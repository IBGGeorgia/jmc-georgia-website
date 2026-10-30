import {NextRequest,NextResponse} from 'next/server';
import {createHash,timingSafeEqual,randomUUID} from 'node:crypto';
import {db,isAdminReady,sameOrigin} from '../../../../lib/test-drive-server';
import {hashCMSPassword} from '../../../../lib/lead-manager-auth';
import {JMC_SCHEMA_SQL} from '../../../../lib/cms-schema';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'};
const reply=(data:unknown,status=200)=>NextResponse.json(data,{status,headers});
const strongSetup=()=>process.env.CMS_SETUP_ENABLED==='true'&&isAdminReady()&&
 (process.env.CMS_SETUP_TOKEN?.length||0)>=43;
const equal=(candidate:string,expected:string)=>{
 const left=createHash('sha256').update(candidate).digest();
 const right=createHash('sha256').update(expected).digest();
 return timingSafeEqual(left,right);
};
const invalid=(x:unknown)=>typeof x!=='string'||x.length<16||x.length>256;
const validUsername=(x:unknown)=>typeof x==='string'&&/^[a-z][a-z0-9._-]{2,63}$/.test(x);
export async function GET(){
 // Public readiness reveals no credentials or database state.
 return reply({setupAvailable:strongSetup()});
}
export async function POST(request:NextRequest){
 if(!strongSetup())return reply({error:'NOT_READY'},503);
 if(!sameOrigin(request))return reply({error:'ORIGIN'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply({error:'TYPE'},415);
 if(Number(request.headers.get('content-length')||0)>4096)return reply({error:'TOO_LARGE'},413);
 let body:Record<string,unknown>;
 try{
  const raw=await request.text();
  if(raw.length>4096)return reply({error:'TOO_LARGE'},413);
  const parsed:unknown=JSON.parse(raw);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return reply({error:'INVALID'},400);
  body=parsed as Record<string,unknown>;
 }catch{return reply({error:'INVALID'},400)}
 const token=body.setupToken;
 if(typeof token!=='string'||token.length>512||
  !equal(token,process.env.CMS_SETUP_TOKEN!))return reply({error:'INVALID_SETUP_TOKEN'},403);
 const username=typeof body.username==='string'?body.username.trim().toLowerCase():'';
 const displayName=typeof body.displayName==='string'?body.displayName.trim():'';
 const password=body.password;
 if(!validUsername(username)||displayName.length<2||displayName.length>120||
  /[\u0000-\u001f<>]/.test(displayName)||invalid(password))return reply({error:'INVALID_ACCOUNT'},400);
 // Complete expensive password derivation before entering a DB transaction.
 const encoded=await hashCMSPassword(password as string);
 const client=await db().connect().catch(()=>null);
 if(!client)return reply({error:'DATABASE_UNAVAILABLE'},503);
 try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock($1)',[20261030]);
  // Idempotent migration + bootstrap share the same transaction: no partial setup.
  await client.query(JMC_SCHEMA_SQL);
  const existing=await client.query<{total:string}>('SELECT COUNT(*)::text AS total FROM jmc_cms_users');
  if(Number(existing.rows[0].total)>0){
   await client.query('ROLLBACK');
   return reply({error:'ALREADY_INITIALIZED'},409);
  }
  const id=randomUUID();
  await client.query(
   `INSERT INTO jmc_cms_users(id,username,display_name,password_hash,role)
   VALUES($1,$2,$3,$4,'admin')`,[id,username,displayName,encoded]);
  await client.query(
   `INSERT INTO jmc_cms_audit_log(actor_user_id,action,subject_id)
     VALUES($1,'cms.initialized',$1)`,[id]);
  await client.query('COMMIT');
  return reply({ok:true,username},201);
 }catch{
  await client.query('ROLLBACK').catch(()=>{});
  return reply({error:'SETUP_FAILED'},503);
 }finally{client.release()}
}
