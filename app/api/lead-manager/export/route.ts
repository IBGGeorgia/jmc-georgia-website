import {currentCMSUser} from '../../../../lib/lead-manager-auth';
import {db} from '../../../../lib/test-drive-server';
export const runtime='nodejs';
export const dynamic='force-dynamic';
function csv(value:unknown){
 let s=String(value??'').replace(/[\r\n\t]+/g,' ');
 if(/^[\s]*[=+\-@]/.test(s))s="'"+s;
 return '"'+s.replace(/"/g,'""')+'"';
}
export async function GET(){
 const user=await currentCMSUser();
 if(!user)return new Response('Unauthorized',{status:401,headers:{'Cache-Control':'no-store'}});
 if(user.role!=='admin')return new Response('Forbidden',{status:403,headers:{'Cache-Control':'no-store'}});
 try{
  const q=await db().query(`SELECT id,full_name,phone,model_slug,preferred_date,status,
   source,medium,campaign,content,marketing_opt_in,notes,created_at,updated_at
   FROM jmc_test_drive_leads ORDER BY created_at DESC LIMIT 10000`);
  const cols=['id','full_name','phone','model_slug','preferred_date','status','source','medium',
   'campaign','content','marketing_opt_in','notes','created_at','updated_at'];
  const rows=[cols.join(','),...q.rows.map(row=>cols.map(k=>csv(row[k])).join(','))];
  return new Response('\uFEFF'+rows.join('\r\n'),{headers:{
   'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="jmc-test-drive-leads.csv"',
   'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 }catch{return new Response('Unavailable',{status:503})}
}
