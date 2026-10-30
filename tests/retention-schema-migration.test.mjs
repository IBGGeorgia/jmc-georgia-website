import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import pg from 'pg';

test('one-time migration safely restores old retention schema without changing leads',async()=>{
 if(process.env.TEST_RETENTION_CI!=='1')return;
 const url=process.env.DATABASE_URL||'';
 if(!url.includes('127.0.0.1:5432/jmc_test'))
  throw Error('TEST_REQUIRES_DISPOSABLE_DATABASE');
 const pool=new pg.Pool({connectionString:url});
 const id=randomUUID();
 try{
  await pool.query(`INSERT INTO jmc_test_drive_leads
   (id,full_name,phone,model_slug,consent_version,ip_fingerprint)
   VALUES ($1,'Synthetic CI Customer','+995599000001','vigus','ci','d')`,[id]);
  await pool.query('DROP TABLE jmc_lead_retention_health');
  await pool.query('ALTER TABLE jmc_test_drive_leads DROP COLUMN retention_hold_until');
  const disabled={...process.env,JMC_RETENTION_SCHEMA_MIGRATION_ONCE:'false'};
  const noChange=spawnSync(process.execPath,['scripts/apply-retention-schema-once.mjs'],
   {env:disabled,encoding:'utf8',timeout:12000});
  assert.equal(noChange.status,0);
  const missing=await pool.query(`SELECT
   to_regclass('public.jmc_lead_retention_health') IS NOT NULL AS health`);
  assert.equal(missing.rows[0].health,false);
  const enabled={...process.env,JMC_RETENTION_SCHEMA_MIGRATION_ONCE:'true'};
  for(let i=0;i<2;i++){
   const result=spawnSync(process.execPath,['scripts/apply-retention-schema-once.mjs'],
    {env:enabled,encoding:'utf8',timeout:12000});
   assert.equal(result.status,0);
   assert.match(result.stdout,/JMC_RETENTION_MIGRATION_OK/);
  }
  const schema=await pool.query(`SELECT
   to_regclass('public.jmc_lead_retention_health') IS NOT NULL AS health,
   EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public'
     AND table_name='jmc_test_drive_leads'
     AND column_name='retention_hold_until') AS hold`);
  assert.equal(schema.rows[0].health,true);
  assert.equal(schema.rows[0].hold,true);
  const row=await pool.query('SELECT id,full_name,phone FROM jmc_test_drive_leads WHERE id=$1',[id]);
  assert.equal(row.rows.length,1);
  assert.equal(row.rows[0].phone,'+995599000001');
 }finally{
  await pool.query('DELETE FROM jmc_test_drive_leads WHERE id=$1',[id]).catch(()=>{});
  await pool.end();
 }
});

test('one-time migration is a no-op without approval and database URL',()=>{
 const env={...process.env};
 delete env.DATABASE_URL;
 delete env.JMC_RETENTION_SCHEMA_MIGRATION_ONCE;
 const result=spawnSync(process.execPath,['scripts/apply-retention-schema-once.mjs'],
  {env,encoding:'utf8',timeout:5000});
 assert.equal(result.status,0);
 assert.equal(result.stdout,'');
 assert.equal(result.stderr,'');
});
