import {NextResponse} from 'next/server';
import {isPrivacyPolicyPublished} from '../../../../lib/privacy-policy';
import {executeRetentionBridge,retentionBridgeAuthorized,retentionBridgeStatus}
 from '../../../../lib/retention-bridge';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'};
const reply=(body:unknown,status=200)=>NextResponse.json(body,{status,headers});

/** Intended ONLY for the dedicated Render Cron; bearer token is stored in
 * Render env, not public source, URL parameters, HTML, analytics or cookies. */
export async function POST(req:Request){
 if(!retentionBridgeAuthorized(req.headers.get('authorization')))
  return reply({error:'UNAUTHORIZED'},401);
 if(!req.headers.get('content-type')?.startsWith('application/json'))
  return reply({error:'TYPE'},415);
 if(Number(req.headers.get('content-length')||0)>512)
  return reply({error:'TOO_LARGE'},413);
 let mode:unknown;
 try{
  const raw=await req.text();
  if(raw.length>512)return reply({error:'TOO_LARGE'},413);
  const json:unknown=JSON.parse(raw);
  if(!json||typeof json!=='object'||Array.isArray(json))
   return reply({error:'INVALID'},400);
  mode=(json as Record<string,unknown>).mode;
 }catch{return reply({error:'INVALID'},400)}
 if(mode!=='status'&&mode!=='execute')return reply({error:'INVALID'},400);
 if(mode==='execute'&&!(process.env.RETENTION_HTTP_EXECUTION_ENABLED==='true'
  &&isPrivacyPolicyPublished())){
  return reply({error:'EXECUTION_DISABLED'},403);
 }
 try{
  if(mode==='status')return reply(await retentionBridgeStatus());
  return reply({ok:true,...await executeRetentionBridge()});
 }catch{
  // Avoid leaking SQL errors or customer data to public or scheduled logs.
  console.error('JMC retention bridge failed; internal error details suppressed.');
  return reply({error:'RETENTION_UNAVAILABLE'},503);
 }
}
