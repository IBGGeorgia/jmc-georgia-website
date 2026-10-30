/**
 * Render scheduled cleanup entrypoint. Provision first, connect internal PostgreSQL
 * and approve the production retention run separately. Does not run at web startup.
 *
 * Deliberately no-ops until BOTH the internal DB URL and the explicit execution
 * approval are configured in the dedicated Cron Job.
 */
import {spawnSync} from 'node:child_process';

if(!process.env.DATABASE_URL || process.env.JMC_RETENTION_EXECUTION_ENABLED!=='true'){
 console.log('JMC_RETENTION_PAUSED: Cron service is provisioned; secure DATABASE_URL and execution approval are pending. No database changes.');
 process.exit(0);
}
const result=spawnSync(process.execPath,['scripts/purge-expired-leads.mjs','--execute'],{
 env:process.env,stdio:'inherit',timeout:10*60*1000
});
if(result.error){
 console.error('JMC_RETENTION_FAILED: could not start guarded cleanup.');
 process.exit(1);
}
process.exit(result.status??1);
