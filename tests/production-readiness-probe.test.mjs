import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const script='scripts/production-readiness-probe.mjs';
test('Missing database cannot prevent startup and never exposes credentials',()=>{
 const env={...process.env};
 delete env.DATABASE_URL;
 const r=spawnSync(process.execPath,[script],{env,encoding:'utf8',timeout:8000});
 assert.equal(r.status,0);
 assert.match(r.stdout,/JMC_PRODUCTION_SCHEMA: db=not_configured/);
 assert.doesNotMatch(r.stdout,/postgresql:\/\//);
});

test('Disposable PostgreSQL is inspected read-only and reports retention migration',()=>{
 if(process.env.TEST_RETENTION_CI!=='1')return;
 const r=spawnSync(process.execPath,[script],{
  env:process.env,encoding:'utf8',timeout:12000
 });
 assert.equal(r.status,0,r.stderr);
 assert.match(r.stdout,/JMC_PRODUCTION_SCHEMA: db=connected leads=true legal_hold=true heartbeat=true/);
 assert.match(r.stdout,/JMC_RETENTION_PREVIEW: total=\d+ eligible=\d+ protected=\d+; read-only/);
 assert.match(r.stdout,/JMC_RETENTION_HEARTBEAT: ever_run=(true|false) fresh=(true|false)/);
 assert.doesNotMatch(r.stdout,/postgresql:\/\//);
});
