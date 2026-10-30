/**
 * Production Test Drive launch preflight.
 * Intentionally NEVER sends a lead, invokes cleanup execution or uses secrets.
 * Observe mode (default) reports blocked approval gates without failing CI.
 * Set JMC_PREFLIGHT_REQUIRE_READY=true ONLY for final launch verification.
 */
const base='https://jmc-georgia.onrender.com';
const required=process.env.JMC_PREFLIGHT_REQUIRE_READY==='true';
const results={};

async function request(path,options={}){
 let error;
 for(let attempt=0;attempt<3;attempt++){
  try{
   const response=await fetch(new URL(path,base),{
    ...options,cache:'no-store',redirect:'manual',
    signal:AbortSignal.timeout(20000),
    headers:{'Accept':'application/json, text/html',...(options.headers||{})}
   });
   return response;
  }catch(e){
   error=e;
   if(attempt<2)await new Promise(resolve=>setTimeout(resolve,1500));
  }
 }
 throw error||Error('NETWORK_UNAVAILABLE');
}
function ok(value,label){
 if(!value)throw Error('PREFLIGHT_FAILED_'+label);
 results[label]='PASS';
}
async function run(){
 const [statusResponse,privacyResponse,formResponse,noAuth,privateInbox]=await Promise.all([
  request('/api/test-drive'),
  request('/privacy'),
  request('/test-drive'),
  request('/api/internal/retention',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({mode:'status'}) // no token: must be rejected before DB use
  }),
  request('/api/lead-manager')
 ]);
 ok(statusResponse.status===200,'INTAKE_STATUS_ENDPOINT');
 const status=await statusResponse.json();
 ok(typeof status?.ready==='boolean','INTAKE_RESPONSE_VALID');
 ok(privacyResponse.status===200,'PRIVACY_PAGE');
 ok(formResponse.status===200,'TEST_DRIVE_PAGE');
 ok(noAuth.status===401,'RETENTION_BRIDGE_REJECTS_ANONYMOUS');
 ok(privateInbox.status===401,'LEADS_INBOX_REJECTS_ANONYMOUS');
 const privacyHtml=await privacyResponse.text();
 const formHtml=await formResponse.text();
 const holding=privacyHtml.includes('პოლიტიკა მზადდება');
 const publicText=privacyHtml.includes('კონფიდენციალურობა');
 ok(publicText,'PRIVACY_PUBLIC_CONTENT');
 const approvedPolicy=privacyHtml.includes('თქვენი მონაცემების დამუშავების პირობები');
 const correctController=privacyHtml.includes('204975376')&&
  privacyHtml.includes('იბერია ბიზნეს ჯგუფი');
 ok(correctController,'CONTROLLER_NAME_AND_ID');
 if(!holding){
  ok(approvedPolicy,'FULL_APPROVED_PRIVACY_POLICY_VISIBLE');
  ok(privacyHtml.includes('1.3'),'APPROVED_PRIVACY_VERSION_VISIBLE');
  ok(privacyHtml.includes('2026-10-30'),'PRIVACY_EFFECTIVE_DATE_VISIBLE');
 }
 // Intake is never permitted to be ready without the actual approved policy.
 ok(!status.ready||(approvedPolicy&&!holding),'READY_REQUIRES_FULL_PUBLIC_POLICY');

 // The public privacy placeholder MUST NOT coexist with collecting real leads.
 ok(!(status.ready&&holding),'APPROVED_POLICY_REQUIRED_FOR_LIVE_INTAKE');
 if(!status.ready){
  ok(formHtml.includes('ონლაინ განაცხადები ჯერ არ მიიღება'),
   'DISABLED_INTAKE_VISIBLE_TO_CUSTOMERS');
 }else{
  ok(formHtml.includes('ონლაინ განაცხადები აქტიურია'),'LIVE_INTAKE_VISIBLE_TO_CUSTOMERS');
 }
 const state=status.ready?'READY_FOR_PUBLIC_INTAKE':'BLOCKED_PENDING_APPROVALS';
 console.log('JMC_LAUNCH_PREFLIGHT: status='+state+'; endpoint_security=pass; no customer data submitted');
 for(const [name,result] of Object.entries(results))console.log('JMC_PREFLIGHT_CHECK: '+name+'='+result);
 if(required&&!status.ready)throw Error('PREFLIGHT_NOT_READY_FOR_LAUNCH');
}
try{await run()}
catch(err){
 console.error('JMC_LAUNCH_PREFLIGHT_FAILED: '+(err instanceof Error?err.message:'unknown'));
 process.exitCode=1;
}
