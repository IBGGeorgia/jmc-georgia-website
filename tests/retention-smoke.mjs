/** Integration smoke test for disposable local/CI PostgreSQL ONLY. */
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {promisify} from 'node:util';
import {execFile as execFileCb} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import pg from 'pg';
const execFile=promisify(execFileCb);
const url=new URL(process.env.DATABASE_URL||'postgresql://invalid/invalid');
if(process.env.TEST_RETENTION_CI!=='1'||!['127.0.0.1','localhost'].includes(url.hostname)
 ||url.pathname!=='/jmc_test')throw Error('Refusing retention CI outside disposable local PostgreSQL');
const sql=await readFile(new URL('../db/test-drive.sql',import.meta.url),'utf8');
const embedded=await readFile(new URL('../lib/cms-schema.ts',import.meta.url),'utf8');
const match=embedded.match(/export const JMC_SCHEMA_SQL = ("(?:\\.|[^"\\])*");/);
assert.ok(match,'embedded schema string must exist');
assert.equal(JSON.parse(match[1]),sql,'embedded and migration schemas must match');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
const ids=[randomUUID(),randomUUID(),randomUUID()];
try{
 const cases=[
  {id:ids[0],age:13,hold:false},
  {id:ids[1],age:11,hold:false},
  {id:ids[2],age:14,hold:true}
 ];
 for(const c of cases){
  await pool.query(`INSERT INTO jmc_test_drive_leads
   (id,full_name,phone,model_slug,consent_version,ip_fingerprint,
    created_at,updated_at,retention_hold_until)
   VALUES($1,'QA Synthetic Lead','+995599000001','vigus','ci-only',$2,
    now()-make_interval(months=>$3::int),now()-make_interval(months=>$3::int),
    CASE WHEN $4::boolean THEN now()+interval '2 months' ELSE NULL END)`,
   [c.id,'e'.repeat(64),c.age,c.hold]);
 }
 const run=async(args,env={})=>execFile(process.execPath,
  [new URL('../scripts/purge-expired-leads.mjs',import.meta.url).pathname,...args],
  {env:{...process.env,...env},timeout:15000});
 const before=await run(['--dry-run']);
 assert.match(before.stdout,/eligible=1/);
 const reject=await run(['--execute']).then(()=>null,e=>e);
 assert.ok(reject,'execute without guard must fail');
 const committed=await run(['--execute'],{JMC_RETENTION_EXECUTION_ENABLED:'true'});
 assert.match(committed.stdout,/deleted=1/);
 const result=await pool.query('SELECT id FROM jmc_test_drive_leads WHERE id=ANY($1::uuid[])',[ids]);
 assert.deepEqual(result.rows.map(r=>r.id).sort(),ids.slice(1).sort());
 console.log('RETENTION_CI_OK: expired synthetic record removed; recent and held records retained');
}finally{
 await pool.query('DELETE FROM jmc_test_drive_leads WHERE id=ANY($1::uuid[])',[ids]).catch(()=>{});
 await pool.end();
}
