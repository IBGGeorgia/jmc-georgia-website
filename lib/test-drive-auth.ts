import 'server-only';
import crypto from 'node:crypto';
import type {NextRequest} from 'next/server';
import {isAdminReady} from './test-drive-server';

export const LEAD_COOKIE='jmc_lead_manager_session';
const secret=()=>process.env.ADMIN_SESSION_SECRET||'';
const adminPassword=()=>process.env.ADMIN_PASSWORD||'';
export const sessionOptions={httpOnly:true,secure:process.env.NODE_ENV==='production',
 sameSite:'strict' as const,path:'/admin',maxAge:8*60*60};
function hmac(s:string){return crypto.createHmac('sha256',secret()).update(s).digest('base64url')}
export function verifyPassword(candidate:string){
 if(!isAdminReady())return false;
 const a=crypto.createHash('sha256').update(candidate).digest();
 const b=crypto.createHash('sha256').update(adminPassword()).digest();
 return crypto.timingSafeEqual(a,b);
}
export function createSession(){
 const payload=Buffer.from(JSON.stringify({exp:Date.now()+8*60*60*1000,role:'sales'})).toString('base64url');
 return payload+'.'+hmac(payload);
}
export function authorized(req:NextRequest){
 if(!isAdminReady())return false;
 const token=req.cookies.get(LEAD_COOKIE)?.value||'';
 const [payload,signature,...extra]=token.split('.');
 if(!payload||!signature||extra.length)return false;
 const a=Buffer.from(hmac(payload)),b=Buffer.from(signature);
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return false;
 try{
  const claims=JSON.parse(Buffer.from(payload,'base64url').toString()) as {role:string;exp:number};
  return claims.role==='sales'&&Number.isFinite(claims.exp)&&claims.exp>Date.now();
 }catch{return false}
}
