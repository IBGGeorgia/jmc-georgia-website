import 'server-only';
import {createHash,timingSafeEqual} from 'node:crypto';
import {db,retentionHealth} from './test-drive-server';

/** A separate high-entropy secret, shared only between Render web and its paid cron.
 * Never return it in a response or log it. */
export function retentionBridgeAuthorized(value:string|null){
 const expected=process.env.JMC_RETENTION_BRIDGE_TOKEN;
 if(!expected||expected.length<64||!value?.startsWith('Bearer '))return false;
 const candidate=value.slice(7);
 if(candidate.length<64||candidate.length>256)return false;
 const a=createHash('sha256').update(expected).digest();
 const b=createHash('sha256').update(candidate).digest();
 return timingSafeEqual(a,b);
}

export async function retentionBridgeStatus(){
 // The bridge never sends individual lead records to the cron service.
 const schema=await db().query<{health_table:boolean;hold_column:boolean}>(`
  SELECT to_regclass('public.jmc_lead_retention_health') IS NOT NULL AS health_table,
   EXISTS(SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='jmc_test_drive_leads'
      AND column_name='retention_hold_until') AS hold_column
 `);
 const readiness=schema.rows[0]?.health_table===true&&schema.rows[0]?.hold_column===true;
 const h=readiness?await retentionHealth():{fresh:false,lastSuccessAt:null};
 return {schemaReady:readiness,fresh:h.fresh,lastSuccessAt:h.lastSuccessAt};
}

/** Same 12-calendar-month policy as the guarded maintenance CLI.
 * Returns counts only, never customer identifiers. */
export async function executeRetentionBridge(){
 const client=await db().connect();
 let locked=false;
 let deleted=0;
 const predicate=`updated_at < now()-interval '12 months'
  AND (retention_hold_until IS NULL OR retention_hold_until <= now())`;
 try{
  const lock=await client.query<{obtained:boolean}>(
   'SELECT pg_try_advisory_lock(20261030,12) AS obtained');
  locked=lock.rows[0]?.obtained===true;
  if(!locked)throw Error('CLEANUP_ALREADY_RUNNING');
  for(let batch=0;batch<40;batch++){
   await client.query('BEGIN');
   let count=0;
   try{
    const result=await client.query(`
     WITH eligible AS (
      SELECT id FROM jmc_test_drive_leads
      WHERE ${predicate}
      ORDER BY updated_at ASC
      LIMIT 500 FOR UPDATE SKIP LOCKED
     )
     DELETE FROM jmc_test_drive_leads AS leads
     USING eligible WHERE leads.id=eligible.id
     RETURNING 1
    `);
    count=result.rowCount??0;
    await client.query('COMMIT');
   }catch(e){
    await client.query('ROLLBACK').catch(()=>{});
    throw e;
   }
   deleted+=count;
   if(count<500)break;
  }
  const remaining=await client.query<{remaining:number}>(`
   SELECT COUNT(*)::int AS remaining FROM jmc_test_drive_leads
   WHERE ${predicate}`);
  if(remaining.rows[0]?.remaining!==0)throw Error('CLEANUP_BACKLOG_REMAINING');
  await client.query(`
   INSERT INTO jmc_lead_retention_health
    (singleton,last_success_at,last_deleted_count)
   VALUES (true,now(),$1)
   ON CONFLICT(singleton) DO UPDATE SET
    last_success_at=EXCLUDED.last_success_at,
    last_deleted_count=EXCLUDED.last_deleted_count`,[deleted]);
  return {deleted};
 }finally{
  if(locked)await client.query('SELECT pg_advisory_unlock(20261030,12)').catch(()=>{});
  client.release();
 }
}
