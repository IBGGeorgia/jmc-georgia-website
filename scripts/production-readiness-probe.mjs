/**
 * Read-only, best-effort operational probe executed during `npm start`.
 * The public site MUST continue to boot even when the DB is unavailable.
 * The probe logs only schema booleans and aggregate retention counts:
 * no customer identifiers, names, phones, credentials or database address.
 * It never performs DDL or DML.
 */
import pg from 'pg';

if(!process.env.DATABASE_URL){
 console.log('JMC_PRODUCTION_SCHEMA: db=not_configured');
}else{
 const pool=new pg.Pool({
  connectionString:process.env.DATABASE_URL,
  max:1,
  connectionTimeoutMillis:4000,
  statement_timeout:5000,
  ssl:process.env.PG_SSL==='true'?{rejectUnauthorized:true}:undefined
 });
 try{
  const result=await pool.query(`SELECT
   to_regclass('public.jmc_test_drive_leads') IS NOT NULL AS leads,
   to_regclass('public.jmc_lead_retention_health') IS NOT NULL AS heartbeat,
   EXISTS(SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='jmc_test_drive_leads'
     AND column_name='retention_hold_until') AS legal_hold`);
  const r=result.rows[0];
  if(!r)throw Error('SCHEMA_QUERY_EMPTY');
  console.log('JMC_PRODUCTION_SCHEMA: db=connected leads='+Boolean(r.leads)+
   ' legal_hold='+Boolean(r.legal_hold)+' heartbeat='+Boolean(r.heartbeat));
  if(r.leads&&r.legal_hold){
   const counts=await pool.query(`SELECT
    COUNT(*)::int AS total,
    COUNT(*) FILTER (WHERE updated_at<now()-interval '12 months'
     AND (retention_hold_until IS NULL OR retention_hold_until<=now()))::int AS eligible,
    COUNT(*) FILTER (WHERE updated_at<now()-interval '12 months'
     AND retention_hold_until>now())::int AS protected
    FROM jmc_test_drive_leads`);
   const n=counts.rows[0];
   console.log('JMC_RETENTION_PREVIEW: total='+n.total+
    ' eligible='+n.eligible+' protected='+n.protected+
    '; read-only; no records changed');
  }else{
   console.log('JMC_RETENTION_PREVIEW: unavailable; migration verification required');
  }
  if(r.heartbeat){
   const h=await pool.query(`SELECT
    COALESCE(MAX(last_success_at)>=now()-interval '36 hours',false) AS fresh,
    COALESCE(MAX(last_success_at) IS NOT NULL,false) AS ever_run
    FROM jmc_lead_retention_health`);
   console.log('JMC_RETENTION_HEARTBEAT: ever_run='+Boolean(h.rows[0]?.ever_run)+
    ' fresh='+Boolean(h.rows[0]?.fresh));
  }
 }catch{
  // Failure never stops public traffic and never prints connection details.
  console.log('JMC_PRODUCTION_SCHEMA: db=unavailable; inspect authorized CMS settings');
 }finally{await pool.end().catch(()=>{});}
}
