import {redirect} from 'next/navigation';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {db} from '../../../lib/test-drive-server';
import {LeadManagerClient} from '../../lead-manager/lead-manager-client';
export const dynamic='force-dynamic';
export default async function AdminLeads(){
 const user=await currentCMSUser();
 if(!user)redirect('/admin');
 if(user.role==='editor')return <section><h1>წვდომა შეზღუდულია</h1><p>ლიდების მოდულზე ნებართვა არ გაქვს.</p></section>;
 let leads:Record<string,unknown>[]=[];let unavailable=false;
 try{
  const r=await db().query(`SELECT id,full_name,phone,model_slug,
   preferred_date::text,status,source,medium,campaign,notes,marketing_opt_in,created_at
   FROM jmc_test_drive_leads ORDER BY created_at DESC LIMIT 200`);
  leads=r.rows.map(x=>({...x,created_at:new Date(x.created_at).toISOString()}));
 }catch{unavailable=true}
 return <section className="jmc-admin-leads">
   <p className="eyebrow">Sales / Leads</p><h1>Test Drive ლიდები</h1>
   {unavailable?<p role="alert">მონაცემთა ბაზის წაკითხვა ვერ მოხერხდა. გადაამოწმე კავშირი და მიგრაცია.</p>
    :<LeadManagerClient leads={leads as any[]} role={user.role}/>}
 </section>;
}
