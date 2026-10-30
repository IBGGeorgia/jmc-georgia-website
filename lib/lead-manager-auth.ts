import 'server-only';
import {createHash,randomBytes,scrypt as rawScrypt,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
import {cookies} from 'next/headers';
import {db,fingerprint,isAdminReady} from './test-drive-server';

const scrypt=promisify(rawScrypt);
const cookieName='jmc_cms_session';
const lifetime=8*60*60;
export type CMSUser={id:string;username:string;display_name:string;role:'admin'|'sales'|'editor'};
const fingerprintSession=(value:string)=>createHash('sha256').update(value).digest('hex');
const dummyHash='scrypt:v1:7ff748a4f142788340587a72e35a1c19:8c44f8e7f0cf54dd6d8b5db72b6f0ea052862ad1e2d628b089ac86ae2a399394c5d61a2829f6a6830ea9cbd4c629e18d756414431b75d9825c20e0368479a16cb36';
const safeEqual=(a:Buffer,b:Buffer)=>a.length===b.length&&timingSafeEqual(a,b);

export async function hashCMSPassword(value:string){
 if(value.length<16||value.length>256)throw Error('PASSWORD_LENGTH');
 const salt=randomBytes(16).toString('hex');
 const derived=await scrypt(value,Buffer.from(salt,'hex'),64) as Buffer;
 return 'scrypt:v1:'+salt+':'+derived.toString('hex');
}
export async function verifyCMSPassword(value:string,encoded:string){
 const parts=encoded.split(':');
 if(parts.length!==4||parts[0]!=='scrypt'||parts[1]!=='v1'||!(/^[a-f0-9]{32}$/).test(parts[2])||!(/^[a-f0-9]{128}$/).test(parts[3])){
  return false;
 }
 const expected=Buffer.from(parts[3],'hex');
 const derived=await scrypt(value,Buffer.from(parts[2],'hex'),64) as Buffer;
 return safeEqual(derived,expected);
}
export async function currentCMSUser():Promise<CMSUser|null>{
 if(!isAdminReady())return null;
 const token=(await cookies()).get(cookieName)?.value||'';
 if(!/^[a-f0-9]{64}$/.test(token))return null;
 try{
  const q=await db().query<CMSUser>(`
   SELECT u.id,u.username,u.display_name,u.role FROM jmc_cms_sessions s
    JOIN jmc_cms_users u ON u.id=s.user_id
    WHERE s.session_hash=$1 AND s.expires_at>now()
      AND s.revoked_at IS NULL AND u.is_active=true LIMIT 1`,
   [fingerprintSession(token)]);
  return q.rows[0]||null;
 }catch{return null}
}
export async function isAdmin(){return Boolean(await currentCMSUser())}
export async function checkAdminCredentials(username:string,password:string,ip:string):Promise<CMSUser|null>{
 if(!isAdminReady()||username.length>64||password.length>256)return null;
 const normalized=username.trim().toLowerCase();
 if(!/^[a-z][a-z0-9._-]{2,63}$/.test(normalized))return null;
 const client=await db().connect();
 const key=fingerprint(ip+':'+normalized);
 try{
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(hashtext($1))',[key]);
  const throttle=await client.query<{attempt_count:number;last_attempt:Date}>(
   'SELECT attempt_count,last_attempt FROM jmc_admin_login_throttle WHERE ip_fingerprint=$1',[key]);
  const recent=Boolean(throttle.rows[0])&&Date.now()-new Date(throttle.rows[0].last_attempt).getTime()<15*60*1000;
  const count=recent?throttle.rows[0].attempt_count:0;
  if(count>=6){await client.query('COMMIT');return null}
  const q=await client.query<CMSUser&{password_hash:string;is_active:boolean}>(
   'SELECT id,username,display_name,role,password_hash,is_active FROM jmc_cms_users WHERE username=$1 LIMIT 1',
   [normalized]);
  const user=q.rows[0];
  const matched=await verifyCMSPassword(password,user?.password_hash||dummyHash);
  const okay=Boolean(user?.is_active)&&matched;
  await client.query(`INSERT INTO jmc_admin_login_throttle(ip_fingerprint,attempt_count,last_attempt)
    VALUES($1,$2,now()) ON CONFLICT(ip_fingerprint)
    DO UPDATE SET attempt_count=$2,last_attempt=now()`,[key,okay?0:count+1]);
  if(okay){
   await client.query('UPDATE jmc_cms_users SET last_login_at=now() WHERE id=$1',[user.id]);
  }
  await client.query('COMMIT');
  return okay?{id:user.id,username:user.username,display_name:user.display_name,role:user.role}:null;
 }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e}
 finally{client.release()}
}
export async function createCMSSession(userId:string){
 const token=randomBytes(32).toString('hex');
 const expires=new Date(Date.now()+lifetime*1000);
 await db().query('INSERT INTO jmc_cms_sessions(session_hash,user_id,expires_at) VALUES($1,$2,$3)',
  [fingerprintSession(token),userId,expires]);
 return {name:cookieName,value:token,httpOnly:true,
  secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,
  path:'/',maxAge:lifetime};
}
export async function revokeCMSSession(){
 const token=(await cookies()).get(cookieName)?.value||'';
 if(/^[a-f0-9]{64}$/.test(token)&&isAdminReady()){
  await db().query('UPDATE jmc_cms_sessions SET revoked_at=now() WHERE session_hash=$1',[fingerprintSession(token)]).catch(()=>{});
 }
 return {name:cookieName,value:'',httpOnly:true,
  secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,
  path:'/',maxAge:0};
}
