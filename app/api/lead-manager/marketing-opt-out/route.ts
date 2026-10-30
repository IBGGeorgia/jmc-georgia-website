import {NextRequest,NextResponse} from 'next/server';
import {currentCMSUser} from '../../../../lib/lead-manager-auth';
import {db,sameOrigin} from '../../../../lib/test-drive-server';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const noStore={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
const reply=(payload:unknown,status=200)=>NextResponse.json(payload,{status,headers:noStore});
const validId=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * An authorized agent can process a marketing-consent withdrawal request
 * without changing the test-drive booking status or freeform notes.
 * Irreversible through this endpoint: no consent reactivation API.
 */
export async function POST(req:NextRequest){
 const actor=await currentCMSUser();
 if(!actor)return reply({error:'UNAUTHORIZED'},401);
 if(actor.role!=='admin'&&actor.role!=='sales')return reply({error:'FORBIDDEN'},403);
 if(!sameOrigin(req))return reply({error:'ORIGIN'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))
  return reply({error:'TYPE'},415);
 if(Number(req.headers.get('content-length')||0)>512)
  return reply({error:'TOO_LARGE'},413);
 let id:unknown;
 try{
  const raw=await req.text();
  if(raw.length>512)return reply({error:'TOO_LARGE'},413);
  const body:unknown=JSON.parse(raw);
  if(!body||typeof body!=='object'||Array.isArray(body))
   return reply({error:'INVALID'},400);
  const fields=Object.keys(body);
  if(fields.length!==1||fields[0]!=='id')return reply({error:'INVALID'},400);
  id=(body as Record<string,unknown>).id;
 }catch{return reply({error:'INVALID'},400)}
 if(typeof id!=='string'||!validId.test(id))return reply({error:'INVALID'},400);

 const client=await db().connect().catch(()=>null);
 if(!client)return reply({error:'UNAVAILABLE'},503);
 try{
  await client.query('BEGIN');
  // Lock the specific row to prevent concurrent double audit or lost updates.
  const lead=await client.query<{marketing_opt_in:boolean}>(
   'SELECT marketing_opt_in FROM jmc_test_drive_leads WHERE id=$1 FOR UPDATE',[id]);
  if(!lead.rowCount){
   await client.query('ROLLBACK');
   return reply({error:'NOT_FOUND'},404);
  }
  if(lead.rows[0].marketing_opt_in){
   // Records the substantive opt-out without overriding sales notes/status.
   await client.query(`UPDATE jmc_test_drive_leads SET
    marketing_opt_in=false,updated_at=now() WHERE id=$1`,[id]);
   await client.query(`INSERT INTO jmc_cms_audit_log
    (actor_user_id,action,subject_id)
    VALUES($1,'lead.marketing_withdrawn',$2)`,[actor.id,id]);
  }
  await client.query('COMMIT');
  return reply({ok:true,withdrawn:true,changed:lead.rows[0].marketing_opt_in});
 }catch{
  await client.query('ROLLBACK').catch(()=>{});
  return reply({error:'UNAVAILABLE'},503);
 }finally{client.release()}
}
