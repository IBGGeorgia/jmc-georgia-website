import {NextResponse} from 'next/server';
import {createLead,getIp,isTestDriveReady,readLead,sameOrigin} from '../../../lib/test-drive-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){
 return NextResponse.json({ready:await isTestDriveReady()},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:Request){
 if(!(await isTestDriveReady()))return NextResponse.json({error:'NOT_ACTIVE'},{status:503});
 if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403});
 if(!(req.headers.get('content-type')||'').startsWith('application/json'))return NextResponse.json({error:'TYPE'},{status:415});
 if(Number(req.headers.get('content-length')||0)>8192)return NextResponse.json({error:'TOO_LARGE'},{status:413});
 try{
  const text=await req.text();
  if(text.length>8192)return NextResponse.json({error:'TOO_LARGE'},{status:413});
  const payload=readLead(JSON.parse(text));
  if(!payload)return NextResponse.json({error:'INVALID'},{status:400});
  const result=await createLead(payload,getIp(req));
  if(result.limited)return NextResponse.json({error:'RATE_LIMIT'},{status:429});
  return NextResponse.json({id:result.id,accepted:true},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(e){if(e instanceof SyntaxError)return NextResponse.json({error:'INVALID'},{status:400});
  console.error('JMC lead submission failed (no personal data logged).');
  return NextResponse.json({error:'UNAVAILABLE'},{status:503})}
}
