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
const emailOk=(s:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const configured=(value?:string)=>Boolean(value&&value.trim());
export function isTestDriveReady(){
 return process.env.TEST_DRIVE_ENABLED==='true'
  &&process.env.PRIVACY_POLICY_APPROVED==='true'
  &&configured(process.env.DATABASE_URL)
  &&(process.env.LEAD_HASH_SECRET?.length??0)>=32
  &&(process.env.PRIVACY_POLICY_VERSION?.length??0)>=3
  &&configured(process.env.RESEND_API_KEY)
  &&emailOk(process.env.RESEND_FROM||'')
  &&emailOk(process.env.SALES_NOTIFY_TO||'');
}
export function isAdminReady(){
 return configured(process.env.DATABASE_URL)
  &&(process.env.LEAD_HASH_SECRET?.length??0)>=32
  &&(process.env.ADMIN_PASSWORD?.length??0)>=16
  &&(process.env.ADMIN_SESSION_SECRET?.length??0)>=32;
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
  const today=new Date().toISOString().slice(0,10);
  const maxDate=new Date(Date.now()+1000*60*60*24*90).toISOString().slice(0,10);
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
export async function notifySales(id:string,input:LeadInput){
 const k=process.env.RESEND_API_KEY||'';
 const from=process.env.RESEND_FROM||'';
 const to=process.env.SALES_NOTIFY_TO||'';
 if(!k||!from||!to)throw Error('NOTIFY_NOT_CONFIGURED');
 const response=await fetch('https://api.resend.com/emails',{
  method:'POST',headers:{Authorization:'Bearer '+k,'Content-Type':'application/json'},
  body:JSON.stringify({from,to:[to],subject:'JMC • ახალი Test Drive მოთხოვნა',
   text:['ახალი მოთხოვნა', 'ID: '+id,'მოდელი: '+input.model,'სახელი: '+input.fullName,
    'ტელეფონი: '+input.phone,'სასურველი დღე: '+(input.preferredDate||'შესათანხმებელი')].join('\n')}),
  signal:AbortSignal.timeout(8000)
 });
 if(!response.ok)throw Error('NOTIFICATION_FAILED');
}
