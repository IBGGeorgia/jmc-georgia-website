/** Guarded operator or scheduled job: DELETE leads older than twelve calendar months
 * since their last recorded substantive update. NEVER run at build or boot.
 * Requires an isolated scheduler, DATABASE_URL and JMC_RETENTION_EXECUTION_ENABLED=true.
 * Dry-run is the default. No customer PII is logged. */
import pg from 'pg';
const args=process.argv.slice(2);
if(args.some(x=>!['--dry-run','--execute'].includes(x))||
 (args.includes('--execute')&&args.includes('--dry-run'))){
 console.error('RETENTION_USAGE: choose --dry-run or --execute');
 process.exit(2);
}
const execute=args.includes('--execute');
if(!process.env.DATABASE_URL){
 console.error('RETENTION_ABORTED: DATABASE_URL missing');
 process.exit(1);
}
if(execute&&process.env.JMC_RETENTION_EXECUTION_ENABLED!=='true'){
 console.error('RETENTION_ABORTED: JMC_RETENTION_EXECUTION_ENABLED is not true');
 process.exit(1);
}
const pool=new pg.Pool({
 connectionString:process.env.DATABASE_URL,max:1,connectionTimeoutMillis:7000,
 ssl:process.env.PG_SSL==='true'?{rejectUnauthorized:true}:undefined
});
const predicate=`updated_at < now() - interval '12 months'
 AND (retention_hold_until IS NULL OR retention_hold_until <= now())`;
let processed=0;
try{
 if(!execute){
  const result=await pool.query(`SELECT COUNT(*)::int AS total
   FROM jmc_test_drive_leads WHERE ${predicate}`);
  console.log('RETENTION_DRY_RUN: eligible='+result.rows[0].total+'; no records changed');
 }else{
  // Bound one execution to 20k records. Re-run until 0 for unusually large backlogs.
  for(let batch=0;batch<40;batch++){
   const client=await pool.connect();
   let count=0;
   try{
    await client.query('BEGIN');
    // Serialize overlapping cron runs; do not disclose any lead contents.
    const lock=await client.query('SELECT pg_try_advisory_xact_lock(20261030,12) AS obtained');
    if(!lock.rows[0].obtained){
     await client.query('ROLLBACK');
     console.log('RETENTION_SKIPPED: another cleanup is active');
     break;
    }
    const result=await client.query(`
     WITH eligible AS (
      SELECT id FROM jmc_test_drive_leads
      WHERE ${predicate}
      ORDER BY updated_at ASC
      LIMIT 500 FOR UPDATE SKIP LOCKED
     )
     DELETE FROM jmc_test_drive_leads AS leads
     USING eligible WHERE leads.id=eligible.id
     RETURNING leads.id
    `);
    count=result.rowCount||0;
    await client.query('COMMIT');
   }catch(e){
    await client.query('ROLLBACK').catch(()=>{});
    throw e;
   }finally{client.release()}
   processed+=count;
   if(count<500)break;
  }
  console.log('RETENTION_COMPLETE: deleted='+processed+'; no personal data logged');
 }
}catch(e){
 console.error('RETENTION_FAILED:',e instanceof Error?e.message:'unknown');
 process.exitCode=1;
}finally{await pool.end()}
