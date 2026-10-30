/**
 * One-time, additive-only retention schema repair for an existing PostgreSQL DB.
 * Executes ONLY with JMC_RETENTION_SCHEMA_MIGRATION_ONCE=true.
 * Does NOT alter or delete customer records, CMS accounts or sessions.
 * It deliberately fails without stopping the public web server from starting.
 */
import pg from 'pg';

if(process.env.JMC_RETENTION_SCHEMA_MIGRATION_ONCE==='true'){
 if(!process.env.DATABASE_URL){
  console.error('JMC_RETENTION_MIGRATION_FAILED: database not configured');
 }else{
  const pool=new pg.Pool({
   connectionString:process.env.DATABASE_URL,max:1,connectionTimeoutMillis:5000,
   ssl:process.env.PG_SSL==='true'?{rejectUnauthorized:true}:undefined
  });
  let client;
  try{
   client=await pool.connect();
   await client.query('BEGIN');
   await client.query("SET LOCAL lock_timeout='5s'");
   await client.query("SET LOCAL statement_timeout='15s'");
   const lock=await client.query(
    'SELECT pg_try_advisory_xact_lock(20261030,99) AS obtained');
   if(lock.rows[0]?.obtained!==true)throw Error('BUSY');
   const table=await client.query(
    "SELECT to_regclass('public.jmc_test_drive_leads') IS NOT NULL AS present");
   if(table.rows[0]?.present!==true)throw Error('LEADS_TABLE_MISSING');
   await client.query(`ALTER TABLE jmc_test_drive_leads
    ADD COLUMN IF NOT EXISTS retention_hold_until timestamptz`);
   await client.query(`CREATE INDEX IF NOT EXISTS jmc_leads_retention_idx
    ON jmc_test_drive_leads(updated_at)`);
   await client.query(`CREATE TABLE IF NOT EXISTS jmc_lead_retention_health(
    singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
    last_success_at timestamptz NOT NULL,
    last_deleted_count integer NOT NULL DEFAULT 0
   )`);
   const verify=await client.query(`SELECT
    to_regclass('public.jmc_lead_retention_health') IS NOT NULL AS heartbeat,
    EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public'
      AND table_name='jmc_test_drive_leads' AND column_name='retention_hold_until') AS hold`);
   if(verify.rows[0]?.heartbeat!==true||verify.rows[0]?.hold!==true)
    throw Error('POSTFLIGHT_INCOMPLETE');
   await client.query('COMMIT');
   console.log('JMC_RETENTION_MIGRATION_OK: retention hold/index/heartbeat schema ensured; no customer records modified');
  }catch{
   if(client)await client.query('ROLLBACK').catch(()=>{});
   console.error('JMC_RETENTION_MIGRATION_FAILED: changes rolled back; no destructive operations');
  }finally{
   if(client)client.release();
   await pool.end().catch(()=>{});
  }
 }
}
