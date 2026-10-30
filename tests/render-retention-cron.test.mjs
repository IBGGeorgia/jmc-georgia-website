import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
const entry='scripts/render-retention-cron.mjs';
test('scheduled job stays paused without internal database URL',()=>{
 const env={...process.env,JMC_RETENTION_EXECUTION_ENABLED:'true'};
 delete env.DATABASE_URL;
 const r=spawnSync(process.execPath,[entry],{encoding:'utf8',env,timeout:5000});
 assert.equal(r.status,0);
 assert.match(r.stdout,/JMC_RETENTION_PAUSED/);
 assert.match(r.stdout,/No database changes/);
});
test('scheduled job stays paused without explicit execution approval',()=>{
 const env={...process.env,DATABASE_URL:'postgresql://never-used.invalid/db'};
 delete env.JMC_RETENTION_EXECUTION_ENABLED;
 const r=spawnSync(process.execPath,[entry],{encoding:'utf8',env,timeout:5000});
 assert.equal(r.status,0);
 assert.match(r.stdout,/JMC_RETENTION_PAUSED/);
});
