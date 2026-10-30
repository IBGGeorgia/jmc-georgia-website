import {NextRequest,NextResponse} from 'next/server';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {db,LEAD_STATUSES,MODEL_SLUGS,sameOrigin} from '../../../lib/test-drive-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const noStore={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
const response=(payload:unknown,status=200)=>NextResponse.json(payload,{status,headers:noStore});
const safeId=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
async function authorized(){
 const user=await currentCMSUser();
 if(!user)return {user:null as Awaited<ReturnType<typeof currentCMSUser>>,code:401};
 if(!['admin','sales'].includes(user.role))return {user:null,code:403};
 return {user,code:200};
}
const escapeLike=(value:string)=>value.replace(/[\\%_]/g,x=>'\\'+x);
export async function GET(req:NextRequest){
 const {user,code}=await authorized();
 if(!user)return response({error:code===401?'UNAUTHORIZED':'FORBIDDEN'},code);
 const params=req.nextUrl.searchParams;
 const status=params.get('status')||'all',model=params.get('model')||'all';
 const q=(params.get('q')||'').trim();
 const pageRaw=params.get('page')||'1',daysRaw=params.get('days')||'all';
 const page=Number(pageRaw);
 if(q.length>100||!Number.isInteger(page)||page<1||page>1000||
  !['all','1','7','30'].includes(daysRaw)||
  !(status==='all'||LEAD_STATUSES.some(x=>x===status))||
  !(model==='all'||MODEL_SLUGS.some(x=>x===model)))return response({error:'INVALID_FILTER'},400);
 const limit=25,offset=(page-1)*limit;
 const conditions:string[]=[];
 const values:(string|number)[]=[];
 const add=(sql:string,value:string|number)=>{
  values.push(value);conditions.push(sql.replace('?', '$'+values.length));
 };
 if(status!=='all')add('status=?',status);
 if(model!=='all')add('model_slug=?',model);
 if(daysRaw!=='all')add("created_at>=now() - (? * INTERVAL '1 day')",Number(daysRaw));
 if(q){
  values.push('%'+escapeLike(q)+'%');
  const p='$'+values.length;
  conditions.push(`(full_name ILIKE ${p} ESCAPE '\\' OR phone ILIKE ${p} ESCAPE '\\' OR model_slug ILIKE ${p} ESCAPE '\\')`);
 }
 const where=conditions.length?'WHERE '+conditions.join(' AND '):'';
 try{
  const [rows,total,stats]=await Promise.all([
   db().query(`SELECT id,full_name,phone,model_slug,preferred_date::text,
     status,notes,source,medium,campaign,marketing_opt_in,created_at,updated_at
     FROM jmc_test_drive_leads ${where}
     ORDER BY created_at DESC,id DESC LIMIT ${limit} OFFSET ${offset}`,values),
   db().query<{count:string}>(`SELECT COUNT(*)::text AS count FROM jmc_test_drive_leads ${where}`,values),
   db().query(`SELECT COUNT(*)::int AS total,
     COUNT(*) FILTER(WHERE status='new')::int AS new,
     COUNT(*) FILTER(WHERE status='contacted')::int AS contacted,
     COUNT(*) FILTER(WHERE status='scheduled')::int AS scheduled,
     COUNT(*) FILTER(WHERE status='completed')::int AS completed,
     COUNT(*) FILTER(WHERE status='cancelled')::int AS cancelled,
     COUNT(*) FILTER(WHERE created_at>=now()-interval '1 day')::int AS today
     FROM jmc_test_drive_leads`)
  ]);
  return response({leads:rows.rows.map(r=>({...r,created_at:new Date(r.created_at).toISOString(),
   updated_at:new Date(r.updated_at).toISOString()})),
   page,limit,total:Number(total.rows[0].count),stats:stats.rows[0]});
 }catch{return response({error:'UNAVAILABLE'},503)}
}
export async function PATCH(req:NextRequest){
 const {user,code}=await authorized();
 if(!user)return response({error:code===401?'UNAUTHORIZED':'FORBIDDEN'},code);
 if(!sameOrigin(req))return response({error:'ORIGIN'},403);
 if(!req.headers.get('content-type')?.startsWith('application/json'))return response({error:'TYPE'},415);
 if(Number(req.headers.get('content-length')||0)>3000)return response({error:'INVALID'},413);
 let b:Record<string,unknown>;
 try{
  const raw=await req.text();
  if(raw.length>3000)return response({error:'INVALID'},413);
  const parsed:unknown=JSON.parse(raw);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return response({error:'INVALID'},400);
  b=parsed as Record<string,unknown>;
 }catch{return response({error:'INVALID'},400)}
 const id=typeof b.id==='string'?b.id:'';
 const status=typeof b.status==='string'?b.status:'';
 const notes=typeof b.notes==='string'?b.notes.trim():'';
 if(!safeId.test(id)||!LEAD_STATUSES.some(s=>s===status)||typeof b.notes!=='string'||notes.length>1000)
  return response({error:'INVALID'},400);
 let client;
 try{client=await db().connect()}catch{return response({error:'UNAVAILABLE'},503)}
 try{
  await client.query('BEGIN');
  const update=await client.query(`UPDATE jmc_test_drive_leads
    SET status=$1,notes=$2,updated_at=now() WHERE id=$3
    RETURNING id,status,notes,updated_at`,[status,notes,id]);
  if(!update.rowCount){await client.query('ROLLBACK');return response({error:'NOT_FOUND'},404)}
  await client.query(`INSERT INTO jmc_cms_audit_log(actor_user_id,action,subject_id)
   VALUES($1,'lead.updated',$2)`,[user.id,id]);
  await client.query('COMMIT');
  return response({updated:true,lead:update.rows[0]});
 }catch{
  await client.query('ROLLBACK').catch(()=>{});
  return response({error:'UNAVAILABLE'},503);
 }finally{client.release()}
}
