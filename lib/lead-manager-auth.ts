import 'server-only';
import {createHmac,randomBytes,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {db,fingerprint,isAdminReady} from './test-drive-server';
const cookieName='jmc_lead_manager';
const lifetime=8*60*60;
function mac(value:string){
 return createHmac('sha256',process.env.ADMIN_SESSION_SECRET||'').update(value).digest('hex');
}
function equal(a:string,b:string){
 const aa=Buffer.from(a),bb=Buffer.from(b);
 return aa.length===bb.length&&timingSafeEqual(aa,bb);
}
export async function isAdmin(){
 if(!isAdminReady())return false;
 const session=(await cookies()).get(cookieName)?.value||'';
 const [issued,nonce,sig]=session.split('.');
 if(!issued||!nonce||!sig||!/^\d+$/.test(issued)||!/^[a-f0-9]{24}$/.test(nonce))return false;
 const issuedAt=Number(issued);
 if(!Number.isSafeInteger(issuedAt)||issuedAt>Date.now()||Date.now()-issuedAt>lifetime*1000)return false;
 return equal(mac(issued+'.'+nonce),sig);
}
export async function checkAdminPassword(password:string,ip:string){
 if(!isAdminReady())return false;
 const key=fingerprint(ip);
 const client=await db().connect();
 try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[key]);
  const q=await client.query<{attempt_count:number,last_attempt:Date}>(
   'SELECT attempt_count,last_attempt FROM jmc_admin_login_throttle WHERE ip_fingerprint=$1',[key]);
  const recent=q.rows[0]&&Date.now()-new Date(q.rows[0].last_attempt).getTime()<15*60*1000;
  const count=recent?q.rows[0].attempt_count:0;
  if(count>=7){await client.query('COMMIT');return false}
  const expected=process.env.ADMIN_PASSWORD||'';
  const okay=equal(password,expected);
  await client.query(`INSERT INTO jmc_admin_login_throttle(ip_fingerprint,attempt_count,last_attempt)
   VALUES($1,$2,now()) ON CONFLICT(ip_fingerprint)
   DO UPDATE SET attempt_count=$2,last_attempt=now()`,[key,okay?0:count+1]);
  await client.query('COMMIT');
  return okay;
 }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e}
 finally{client.release()}
}
export function newSession(){
 const issued=String(Date.now()),nonce=randomBytes(12).toString('hex');
 const value=issued+'.'+nonce;
 return {name:cookieName,value:value+'.'+mac(value),httpOnly:true,
  secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,
  path:'/',maxAge:lifetime};
}
export function clearedSession(){
 return {name:cookieName,value:'',httpOnly:true,
  secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,
  path:'/',maxAge:0};
}
