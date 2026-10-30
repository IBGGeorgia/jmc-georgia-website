/* One-off operator command, never run automatically at build or startup. */
import {readFile} from 'node:fs/promises';
import pg from 'pg';
if(!process.env.DATABASE_URL){
 console.error('MIGRATION_ABORTED: DATABASE_URL is missing. No changes were made.');
 process.exitCode=1;
}else{
 const pool=new pg.Pool({
  connectionString:process.env.DATABASE_URL,max:1,connectionTimeoutMillis:6000,
  ssl:process.env.PG_SSL==='true'?{rejectUnauthorized:true}:undefined
 });
 const client=await pool.connect();
 try{
  await client.query('BEGIN');
  await client.query(await readFile(new URL('../db/test-drive.sql',import.meta.url),'utf8'));
  await client.query('COMMIT');
  const x=await client.query("SELECT COUNT(*)::int AS total FROM information_schema.columns WHERE table_name='jmc_test_drive_leads' AND column_name IN ('id','consent_version','consented_at','status','phone')");
  if(x.rows[0].total!==5)throw Error('REQUIRED_COLUMNS_MISSING');
  console.log('MIGRATION_OK: JMC Test Drive schema verified, with consent timestamp.');
 }catch(e){
  await client.query('ROLLBACK').catch(()=>{});
  console.error('MIGRATION_FAILED:',e instanceof Error?e.message:'unknown issue');
  process.exitCode=1;
 }finally{client.release();await pool.end()}
}
