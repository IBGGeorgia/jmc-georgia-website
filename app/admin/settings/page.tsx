import {redirect} from 'next/navigation';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {db,isAdminReady,isTestDriveReady,retentionHealth} from '../../../lib/test-drive-server';
export const dynamic='force-dynamic';
export default async function AdminSettings(){
 const user=await currentCMSUser();
 if(!user)redirect('/admin');
 let connection=false,accounts:number|null=null;
 try{
  const state=await db().query<{users:string}>(`SELECT
   (SELECT COUNT(*)::text FROM jmc_cms_users WHERE is_active=true) AS users`);
  connection=true;
  if(user.role==='admin')accounts=Number(state.rows[0].users);
 }catch{}
 const setupDisabled=process.env.CMS_SETUP_ENABLED!=='true';
 const [privateIntake,retention]=await Promise.all([isTestDriveReady(),retentionHealth()]);
 const ready=isAdminReady()&&connection;
 const privacyApproved=process.env.PRIVACY_POLICY_APPROVED==='true';
 const items=[
  {title:'PostgreSQL',value:connection?'კავშირი მუშაობს':'კავშირი შეფერხებულია',
   detail:'პერსონალური მონაცემების დაცული შენახვა და სესიების მუშაობა'},
  {title:'CMS ავტორიზაცია',value:ready?'აქტიურია':'შემოწმება საჭიროა',
   detail:accounts!==null?accounts+' აქტიური თანამშრომლის ანგარიში':'ინდივიდუალური ანგარიშები და როლები'},
  {title:'ერთჯერადი Setup',value:setupDisabled?'გამორთულია':'უნდა გამოირთოს',
   detail:'პირველი ადმინისტრატორის შექმნის შემდეგ Setup ყოველთვის უნდა დაიხუროს'},
  {title:'Test Drive',value:privateIntake?'აქტიურია':'მიღება გამორთულია',
   detail:'გააქტიურდება მხოლოდ Privacy-ის, სამუშაო ბაზისა და ავტომატური წაშლის დასტურის შემდეგ'},
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
  {!setupDisabled&&<p role="alert" className="jmc-cms-users-error">
   უსაფრთხოების რეკომენდაცია: პირველი Admin ანგარიშის შექმნის შემდეგ Render-ში გამორთე CMS_SETUP_ENABLED და წაშალე CMS_SETUP_TOKEN.
  </p>}
 </section>;
}
