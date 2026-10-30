/**
 * One-off operator action only. Never run as part of a build or deploy.
 * Supply all inputs through a trusted ephemeral environment, not shell history.
 */
import pg from 'pg';
import {randomUUID,randomBytes,scrypt as rawScrypt} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(rawScrypt);
const username=(process.env.CMS_BOOTSTRAP_USERNAME||'').trim().toLowerCase();
const display=(process.env.CMS_BOOTSTRAP_DISPLAY_NAME||'').trim();
const password=process.env.CMS_BOOTSTRAP_PASSWORD||'';
const database=process.env.DATABASE_URL;
if(!database||!/^[a-z][a-z0-9._-]{2,63}$/.test(username)
  ||display.length<2||display.length>120||password.length<16||password.length>256){
 console.error('CMS_SETUP_ABORTED: DATABASE_URL, CMS_BOOTSTRAP_USERNAME, CMS_BOOTSTRAP_DISPLAY_NAME and a 16+ character CMS_BOOTSTRAP_PASSWORD are required.');
 process.exit(1);
}
const salt=randomBytes(16);
const hash='scrypt:v1:'+salt.toString('hex')+':'+(await scrypt(password,salt,64)).toString('hex');
const pool=new pg.Pool({connectionString:database,max:1,connectionTimeoutMillis:7000,
 ssl:process.env.PG_SSL==='true'?{rejectUnauthorized:true}:undefined});
try{
 const result=await pool.query(`INSERT INTO jmc_cms_users(id,username,display_name,password_hash,role)
  VALUES($1,$2,$3,$4,'admin') ON CONFLICT(username) DO NOTHING RETURNING username`,
  [randomUUID(),username,display,hash]);
 if(!result.rowCount){console.error('CMS_SETUP_ABORTED: User already exists; never overwrite credentials implicitly.');process.exitCode=1}
 else console.log('CMS_ADMIN_CREATED:',result.rows[0].username);
}catch(e){console.error('CMS_SETUP_FAILED:',e instanceof Error?e.message:'unknown');process.exitCode=1}
finally{await pool.end()}
