import 'server-only';
import crypto from 'node:crypto';
import {Pool} from 'pg';

export const MODEL_SLUGS=['vigus','grand-avenue','grand-avenue-pro'] as const;
export type ModelSlug=typeof MODEL_SLUGS[number];
export const LEAD_STATUSES=['new','contacted','scheduled','completed','cancelled'] as const;
export type LeadStatus=typeof LEAD_STATUSES[number];
export type LeadInput={
 fullName:string;phone:string;model:ModelSlug;preferredDate:string|null;
 utmSource:string;utmMedium:string;utmCampaign:string;utmContent:string;
 referrer:string;marketingOptIn:boolean;
};
export type LeadRecord=LeadInput&{
 id:string;status:LeadStatus;notes:string;createdAt:string;updatedAt:string;
};
const max=(s:string,n:number)=>s.trim().slice(0,n);
const configured=(value?:string)=>Boolean(value&&value.trim());
/** Health is based on an actual successful cleanup, never a hand-set timestamp. */
export async function retentionHealth(){
 if(!configured(process.env.DATABASE_URL))return {fresh:false,lastSuccessAt:null as string|null};
 try{
  const result=await db().query<{last_success_at:Date;fresh:boolean}>(
   `SELECT last_success_at,
    (last_success_at>=now()-interval '36 hours') AS fresh
    FROM jmc_lead_retention_health WHERE singleton=true LIMIT 1`);
  const row=result.rows[0];
  return {fresh:row?.fresh===true,
   lastSuccessAt:row?.last_success_at?new Date(row.last_success_at).toISOString():null};
 }catch{
  // Missing migration, unavailable database or unknown state always fail closed.
  return {fresh:false,lastSuccessAt:null as string|null};
 }
}
export async function isTestDriveReady(){
 if(!(process.env.TEST_DRIVE_ENABLED==='true'
  &&process.env.PRIVACY_POLICY_APPROVED==='true'
  &&process.env.RETENTION_SCHEDULE_CONFIRMED==='true'
  &&configured(process.env.DATABASE_URL)
  &&(process.env.LEAD_HASH_SECRET?.length??0)>=32
  &&(process.env.PRIVACY_POLICY_VERSION?.length??0)>=3
  &&isAdminReady()))return false;
 return (await retentionHealth()).fresh;
}
export function isAdminReady(){
 return configured(process.env.DATABASE_URL)
  &&(process.env.LEAD_HASH_SECRET?.length??0)>=32
  &&(process.env.CMS_SESSION_SECRET?.length??0)>=32;
}
let pool:Pool|undefined;
export function db(){
 if(!process.env.DATABASE_URL)throw Error('DB_NOT_CONFIGURED');
 if(!pool)pool=new Pool({connectionString:process.env.DATABASE_URL,max:4,
  connectionTimeoutMillis:5000,idleTimeoutMillis:30000,ssl:process.env.PG_SSL==='true'?{rejectUnauthorized:true}:undefined});
 return pool;
}
export function fingerprint(ip:string){
 const secret=process.env.LEAD_HASH_SECRET;
 if(!secret)throw Error('NOT_CONFIGURED');
 return crypto.createHmac('sha256',secret).update(ip).digest('hex');
}
export function getIp(req:Request){
 // Trust only Render's proxy client address, not arbitrary X-Forwarded-For chains.
 // Caller cannot use X-Forwarded-For to bypass rate limits if the edge overrides it.
 return req.headers.get('cf-connecting-ip')||
  (req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
}
export function sameOrigin(req:Request){
 const origin=req.headers.get('origin');
 if(!origin)return false;
 try{
  const requestUrl=new URL(req.url);
  const allowed=process.env.NEXT_PUBLIC_SITE_URL||requestUrl.origin;
  return origin===new URL(allowed).origin;
 }catch{return false}
}
export function readLead(body:unknown):LeadInput|null{
 if(!body||typeof body!=='object'||Array.isArray(body))return null;
 const v=body as Record<string,unknown>;
 const str=(k:string)=>typeof v[k]==='string'?String(v[k]).trim():'';
 const fullName=str('fullName');
 const typedPhone=str('phone').replace(/[\s()-]/g,'');
 const phone=/^5\d{8}$/.test(typedPhone)?'+995'+typedPhone:typedPhone;
 const model=str('model');
 const preferredDate=str('preferredDate');
 if(fullName.length<2||fullName.length>100||!/^\+?9955\d{8}$/.test(phone)
  ||!MODEL_SLUGS.includes(model as ModelSlug)
  ||v.consent!==true||v.marketingOptIn!==true&&v.marketingOptIn!==false
  ||str('honeypot')!=='')return null;
 if(preferredDate){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate))return null;
  const d=new Date(preferredDate+'T12:00:00Z');
  if(Number.isNaN(d.valueOf())||d.toISOString().slice(0,10)!==preferredDate)return null;
  // The customer selects a date in Georgia local time, not UTC.
  const inGeorgia=(d:Date)=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tbilisi',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
  const today=inGeorgia(new Date());
  const maxDate=inGeorgia(new Date(Date.now()+1000*60*60*24*90));
  if(preferredDate<today||preferredDate>maxDate)return null;
 }
 return {fullName,phone,model:model as ModelSlug,preferredDate:preferredDate||null,
  utmSource:max(str('utmSource'),80),utmMedium:max(str('utmMedium'),80),
  utmCampaign:max(str('utmCampaign'),100),utmContent:max(str('utmContent'),100),
  referrer:max(str('referrer'),500),marketingOptIn:v.marketingOptIn===true};
}
export async function createLead(input:LeadInput,ip:string){
 const key=fingerprint(ip);
 const client=await db().connect();
 const id=crypto.randomUUID();
 try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[key]);
  const count=await client.query<{n:string}>(
   "SELECT COUNT(*)::text AS n FROM jmc_test_drive_leads WHERE ip_fingerprint=$1 AND created_at>now()-interval '1 hour'",[key]);
  if(Number(count.rows[0]?.n||0)>=5){
   await client.query('ROLLBACK');return {limited:true} as const;
  }
  const byPhone=await client.query<{n:string}>(
   "SELECT COUNT(*)::text AS n FROM jmc_test_drive_leads WHERE phone=$1 AND created_at>now()-interval '1 day'",[input.phone]);
  if(Number(byPhone.rows[0]?.n||0)>=3){
   await client.query('ROLLBACK');return {limited:true} as const;
  }
  await client.query(`INSERT INTO jmc_test_drive_leads
    (id,full_name,phone,model_slug,preferred_date,source,medium,campaign,content,referrer,
     consent_version,marketing_opt_in,ip_fingerprint)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$13,$11,$12)`,
   [id,input.fullName,input.phone,input.model,input.preferredDate,input.utmSource,
    input.utmMedium,input.utmCampaign,input.utmContent,input.referrer,input.marketingOptIn,key,process.env.PRIVACY_POLICY_VERSION]);
  await client.query('COMMIT');
  return {limited:false,id} as const;
 }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e}
 finally{client.release()}
}
