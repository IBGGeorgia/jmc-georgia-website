import type {Metadata} from 'next';
import {Header,Footer} from '../site-components';
import {AdminLogin,LeadManagerClient} from './lead-manager-client';
import {isAdmin} from '../../lib/lead-manager-auth';
import {db,isAdminReady} from '../../lib/test-drive-server';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Lead Manager — ადმინისტრაცია',robots:{index:false,follow:false}};
export default async function LeadManager(){
 const ready=isAdminReady();
 const authorized=ready&&await isAdmin();
 let leads:any[]=[];let unavailable=false;
 if(authorized){
  try{
   const result=await db().query(`SELECT id,full_name,phone,model_slug,
    preferred_date::text,status,source,medium,campaign,notes,marketing_opt_in,created_at
    FROM jmc_test_drive_leads ORDER BY created_at DESC LIMIT 200`);
   leads=result.rows.map(row=>({...row,created_at:new Date(row.created_at).toISOString()}));
  }catch{unavailable=true}
 }
 return <><Header/><main className="container jmc-manager-page">
  <header className="page-head jmc-page-intro">
   <p className="eyebrow">JMC Georgia / Sales Operations</p>
   <h1>Lead Manager</h1>
   <p className="jmc-page-lead">ტესტ-დრაივის განაცხადების სტატუსები და გაყიდვების გუნდთან კომუნიკაცია.</p>
  </header>
  {!ready?<section className="jmc-manager-state"><h2>ადმინისტრაცია ჯერ არ არის გააქტიურებული</h2>
   <p>საჭიროა მუდმივი მონაცემთა ბაზა და დაცული ავტორიზაციის პარამეტრები. რეალური მომხმარებლების მონაცემები არ ინახება.</p></section>
  :!authorized?<section className="jmc-manager-state"><h2>დაცული წვდომა</h2><p>შეიყვანე უფლებამოსილი ადმინისტრატორის პაროლი.</p><AdminLogin/></section>
  :unavailable?<section className="jmc-manager-state" role="alert"><h2>მონაცემები დროებით მიუწვდომელია</h2>
   <p>გადაამოწმე მონაცემთა ბაზა და მიგრაცია.</p></section>
  :<LeadManagerClient leads={leads}/>}
 </main><Footer/></>;
}
