import {NextResponse} from 'next/server';
import {checkAdminCredentials,createCMSSession,revokeCMSSession} from '../../../../lib/lead-manager-auth';
import {getIp,isAdminReady,sameOrigin} from '../../../../lib/test-drive-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const noStore={'Cache-Control':'no-store'};
export async function POST(req:Request){
 if(!isAdminReady())return NextResponse.json({error:'NOT_CONFIGURED'},{status:503,headers:noStore});
 if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403,headers:noStore});
 if(Number(req.headers.get('content-length')||0)>2048)return NextResponse.json({error:'INVALID'},{status:413,headers:noStore});
 try{
  const raw=await req.text();
  if(raw.length>2048)return NextResponse.json({error:'INVALID'},{status:413,headers:noStore});
  const body=JSON.parse(raw) as {username?:unknown;password?:unknown};
  const username=typeof body.username==='string'?body.username:'';
  const password=typeof body.password==='string'?body.password:'';
  if(!username||!password||password.length>256)return NextResponse.json({error:'INVALID'},{status:400,headers:noStore});
  const user=await checkAdminCredentials(username,password,getIp(req));
  if(!user)return NextResponse.json({error:'INVALID_CREDENTIALS'},{status:401,headers:noStore});
  const session=await createCMSSession(user.id);
  const response=NextResponse.json({ok:true,role:user.role},{headers:noStore});
  response.cookies.set(session);
  return response;
 }catch{return NextResponse.json({error:'UNAVAILABLE'},{status:503,headers:noStore})}
}
export async function DELETE(req:Request){
 if(!sameOrigin(req))return NextResponse.json({error:'ORIGIN'},{status:403,headers:noStore});
 const session=await revokeCMSSession();
 const response=NextResponse.json({ok:true},{headers:noStore});
 response.cookies.set(session);
 return response;
}
