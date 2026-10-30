import {NextResponse} from 'next/server';
import {checkAdminPassword,clearedSession,newSession} from '../../../../lib/lead-manager-auth';
import {getIp,isAdminReady,sameOrigin} from '../../../../lib/test-drive-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 if(!isAdminReady())return NextResponse.json({error:'NOT_CONFIGURED'},{status:503});
 if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403});
 if(Number(req.headers.get('content-length')||0)>2048)return NextResponse.json({error:'INVALID'},{status:400});
 try{
  const body=await req.json() as {password?:unknown};
  const password=typeof body.password==='string'?body.password:'';
  if(!password||password.length>256)return NextResponse.json({error:'INVALID'},{status:400});
  const okay=await checkAdminPassword(password,getIp(req));
  if(!okay)return NextResponse.json({error:'INVALID_CREDENTIALS'},{status:401});
  const response=NextResponse.json({ok:true});
  response.cookies.set(newSession());
  response.headers.set('Cache-Control','no-store');
  return response;
 }catch{return NextResponse.json({error:'UNAVAILABLE'},{status:503})}
}
export async function DELETE(req:Request){
 if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403});
 const response=NextResponse.json({ok:true});
 response.cookies.set(clearedSession());
 return response;
}
