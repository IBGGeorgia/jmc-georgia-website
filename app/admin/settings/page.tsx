import {redirect} from 'next/navigation';
import {isPrivacyPolicyPublished} from '../../../lib/privacy-policy';
import Link from 'next/link';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {db,isAdminReady,isTestDriveReady,retentionHealth} from '../../../lib/test-drive-server';
export const dynamic='force-dynamic';
export default async function AdminSettings(){
 const user=await currentCMSUser();
 if(!user)redirect('/admin');
 let connection=false,accounts:number|null=null,retentionSchema=false;
 try{
  const state=await db().query<{users:string}>(`SELECT
   (SELECT COUNT(*)::text FROM jmc_cms_users WHERE is_active=true) AS users`);
  connection=true;
  if(user.role==='admin')accounts=Number(state.rows[0].users);
  const migration=await db().query<{health_table:boolean;hold_column:boolean}>(`
   SELECT to_regclass('public.jmc_lead_retention_health') IS NOT NULL AS health_table,
    EXISTS(SELECT 1 FROM information_schema.columns
     WHERE table_schema='public' AND table_name='jmc_test_drive_leads'
      AND column_name='retention_hold_until') AS hold_column`);
  retentionSchema=migration.rows[0]?.health_table===true&&migration.rows[0]?.hold_column===true;
 }catch{}
 const setupDisabled=process.env.CMS_SETUP_ENABLED!=='true';
 const [privateIntake,retention]=await Promise.all([isTestDriveReady(),retentionHealth()]);
 const ready=isAdminReady()&&connection;
 const privacyApproved=isPrivacyPolicyPublished();
 const items=[
  {title:'PostgreSQL',value:connection?'კავშირი მუშაობს':'კავშირი შეფერხებულია',
   detail:'პერსონალური მონაცემების დაცული შენახვა და სესიების მუშაობა'},
  {title:'CMS ავტორიზაცია',value:ready?'აქტიურია':'შემოწმება საჭიროა',
   detail:accounts!==null?accounts+' აქტიური თანამშრომლის ანგარიში':'ინდივიდუალური ანგარიშები და როლები'},
  {title:'ერთჯერადი Setup',value:setupDisabled?'გამორთულია':'უნდა გამოირთოს',
   detail:'პირველი ადმინისტრატორის შექმნის შემდეგ Setup ყოველთვის უნდა დაიხუროს'},
  {title:'Test Drive',value:privateIntake?'აქტიურია':'მიღება გამორთულია',
   detail:'გააქტიურდება მხოლოდ Privacy-ის, სამუშაო ბაზისა და ავტომატური წაშლის დასტურის შემდეგ'},
  {title:'მონაცემთა ბაზის მიგრაცია',value:!connection?'ბაზის კავშირი შეფერხებულია':retentionSchema?'სქემა განახლებულია':'სქემის განახლება საჭიროა',
   detail:'შემოწმებულია საჭირო სვეტი და რეალური წმენდის ისტორიის ცხრილი; მონაცემები არ იცვლება'},
  {title:'12-თვიანი შენახვა',value:retention.fresh?'ავტომატური წმენდა დადასტურებულია':'ავტომატური წმენდა ვერ დადასტურდა',
   detail:retention.lastSuccessAt?'ბოლო წარმატებული გაშვება: '+new Date(retention.lastSuccessAt).toLocaleString('ka-GE',{timeZone:'Asia/Tbilisi'}):'ჯერ არ არსებობს წარმატებული Production გაშვების ჩანაწერი'},
  {title:'წაშლის განრიგი',value:process.env.RETENTION_SCHEDULE_CONFIRMED==='true'?'ოპერატორმა დაადასტურა':'დასადასტურებელია',
   detail:'დადასტურება არ ცვლის ბოლო 36 საათის რეალური გაშვების შემოწმებას'},
  {title:'კონფიდენციალურობა',value:privacyApproved?'დადასტურებულია':'დასამტკიცებელია',
   detail:'საჯარო სამართლებრივი დოკუმენტი და შენახვის წესები'},
  {title:'Zoho CRM',value:'მომავალი ინტეგრაცია',
   detail:'ლიდების სინქრონიზაცია დაგეგმილია, ადგილობრივი PostgreSQL რჩება საწყის წყაროდ'}
 ];
 return <section className="jmc-admin-settings">
  <p className="eyebrow">Workspace / Settings</p>
  <h1>სისტემის მდგომარეობა</h1>
  <p>Production ინფრასტრუქტურისა და ფუნქციების მიმდინარე მდგომარეობა.
   ეს გვერდი არ აჩვენებს პაროლებს, მონაცემთა ბაზის მისამართს ან საიდუმლო გასაღებებს.</p>
  <div className="jmc-admin-status-grid">
   {items.map(item=><article key={item.title}>
    <h2>{item.title}</h2><strong>{item.value}</strong><p>{item.detail}</p>
   </article>)}
  </div>
  {user.role==='admin'&&<section className="jmc-admin-feature-card" aria-labelledby="jmc-pitr-review" style={{marginTop:24}}>
   <div>
    <p className="eyebrow">Launch Readiness / Backup</p>
    <h2 id="jmc-pitr-review" style={{fontSize:'clamp(21px,2.3vw,30px)'}}>Recovery-ის შემოწმება</h2>
    <p><strong>Recovery-ის ხელმისაწვდომობა დადასტურებულია.</strong> 2026 წლის 30 ოქტომბერს
     უშუალოდ Render-ის PostgreSQL Recovery გვერდზე გამოჩნდა 7-დღიანი Point-in-Time Recovery-ის
     ფანჯარა და Restore database ღილაკი.</p>
    <p>ეს ადასტურებს აღდგენის შესაძლებლობის ხელმისაწვდომობას, მაგრამ არა რეალურად
     შესრულებულ აღდგენის ტესტს. არ დააჭირო Restore Database-ს, სანამ იზოლირებული
     ტესტი და დამატებითი ხარჯები ცალკე არ იქნება შეთანხმებული.</p>
    <p>Test Drive-ის მიღება და მონაცემთა ავტომატური წაშლა ამ შემოწმებით არ აქტიურდება.</p>
   </div>
   <Link href="https://dashboard.render.com/d/dpg-dbi4ess9v7es738lu3c0-a/recovery" className="button" target="_blank" rel="noopener noreferrer">
    Render PostgreSQL ↗
   </Link>
  </section>}
  <p className="jmc-info-footnote">სავალდებულო წარმოების ნაბიჯები: PostgreSQL-ის მიგრაციის შემოწმება,
   მონაცემთა დამტკიცებული პოლიტიკის გამოქვეყნება, უსაფრთხო ყოველდღიური Cron Job და
   სარეზერვო ასლების წესების დადასტურება. სტატუსის გვერდი თავად არ ცვლის ბაზას.</p>
  {!setupDisabled&&<p role="alert" className="jmc-cms-users-error">
   უსაფრთხოების რეკომენდაცია: პირველი Admin ანგარიშის შექმნის შემდეგ Render-ში გამორთე CMS_SETUP_ENABLED და წაშალე CMS_SETUP_TOKEN.
  </p>}
 </section>;
}
