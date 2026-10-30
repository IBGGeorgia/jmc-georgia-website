/**
 * One daily Render Cron entrypoint. First choice: authenticated HTTPS bridge to
 * the already-connected JMC web service (no duplicated DB credentials).
 * Legacy operator-only direct DB connection remains available if configured.
 * All execution gates fail closed; never run during web builds or startup.
 */
import {spawnSync} from 'node:child_process';

const approved=process.env.JMC_RETENTION_EXECUTION_ENABLED==='true';
const secret=process.env.JMC_RETENTION_BRIDGE_TOKEN;
const url=process.env.JMC_RETENTION_BRIDGE_URL||
 'https://jmc-georgia.onrender.com/api/internal/retention';

if(secret){
 try{
  if(secret.length<64)throw Error('INVALID_BRIDGE_SECRET');
  const parsed=new URL(url);
  const expected='https://jmc-georgia.onrender.com/api/internal/retention';
  const testLocal=process.env.TEST_DRIVE_E2E==='1'&&
   parsed.protocol==='http:'&&['localhost','127.0.0.1'].includes(parsed.hostname)&&
   parsed.pathname==='/api/internal/retention';
  if((parsed.href!==expected&&!testLocal)||parsed.username||parsed.password)
   throw Error('UNAPPROVED_BRIDGE_DESTINATION');
  const mode=approved?'execute':'status';
  const response=await fetch(url,{
   method:'POST',
   headers:{authorization:'Bearer '+secret,'Content-Type':'application/json'},
   body:JSON.stringify({mode}),signal:AbortSignal.timeout(240000),cache:'no-store'
  });
  if(!response.ok)throw Error('BRIDGE_HTTP_'+response.status);
  const result=await response.json();
  if(mode==='status'){
   if(typeof result.schemaReady!=='boolean')throw Error('INVALID_BRIDGE_RESPONSE');
   console.log('JMC_RETENTION_BRIDGE_CONNECTED: schemaReady='+result.schemaReady+
    '; cleanup disabled; no database changes.');
  }else{
   if(result.ok!==true||!Number.isInteger(result.deleted)||result.deleted<0)
    throw Error('INVALID_BRIDGE_RESPONSE');
   console.log('JMC_RETENTION_COMPLETE: deleted='+result.deleted+
    '; no personal data logged.');
  }
 }catch(e){
  console.error('JMC_RETENTION_BRIDGE_FAILED:',
   e instanceof Error?e.message:'unknown error');
  process.exitCode=1;
 }
}else if(process.env.DATABASE_URL&&approved){
 // Direct mode is for a trusted internal operator only; never transmit DB URL
 // to GitHub or the public web. Guarding still applies inside the CLI itself.
 const result=spawnSync(process.execPath,['scripts/purge-expired-leads.mjs','--execute'],{
  env:process.env,stdio:'inherit',timeout:10*60*1000
 });
 if(result.error)console.error('JMC_RETENTION_FAILED: cleanup process could not start.');
 process.exitCode=result.status??1;
}else{
 console.log('JMC_RETENTION_PAUSED: Cron service is provisioned; secure DATABASE_URL and execution approval are pending. No database changes.');
}
