import Link from 'next/link';
import {currentCMSUser} from '../../lib/lead-manager-auth';
import {db,isAdminReady} from '../../lib/test-drive-server';
import {AdminLogin} from '../lead-manager/lead-manager-client';
export const dynamic='force-dynamic';
type Metrics={total:string;new:string;contacted:string;scheduled:string;completed:string};
export default async function AdminHome(){
 const user=await currentCMSUser();
 if(!user)return <section className="jmc-admin-auth"><div className="jmc-admin-auth-copy">
  <p className="eyebrow">JMC / Internal Workspace</p><h1>JMC Admin</h1>
  <p>დაცული სამუშაო სივრცე ლიდების, მომხმარებლებისა და სამომავლოდ საიტის ფუნქციების მართვისთვის.</p>
  </div>{isAdminReady()?<div className="jmc-admin-auth-card"><h2>ავტორიზაცია</h2><p>შეიყვანე პირადი მომხმარებლის სახელი და პაროლი.</p><AdminLogin/>{process.env.CMS_SETUP_ENABLED==='true'&&<Link href="/admin/setup" className="jmc-admin-setup-link">პირველი ადმინისტრატორის შექმნა ↗</Link>}</div>
   :<div className="jmc-admin-auth-card"><h2>სისტემა მზადდება</h2><p>მომხმარებლების დაცული ავტორიზაცია გააქტიურდება მონაცემთა ბაზის დაკავშირებისა და პირველი ადმინისტრატორის შექმნის შემდეგ.</p><Link href="/admin/setup" className="button">პირველი ადმინისტრატორის დაყენება ↗</Link></div>}</section>;
 let stats:Metrics|null=null;
 if(user.role!=='editor')try{
  const r=await db().query<Metrics>(`SELECT COUNT(*)::text AS total,
    COUNT(*) FILTER(WHERE status='new')::text AS new,
    COUNT(*) FILTER(WHERE status='contacted')::text AS contacted,
    COUNT(*) FILTER(WHERE status='scheduled')::text AS scheduled,
    COUNT(*) FILTER(WHERE status='completed')::text AS completed
    FROM jmc_test_drive_leads`);
  stats=r.rows[0];
 }catch{}
 const cards=[
  {label:'ყველა განაცხადი',value:stats?.total??'—'},
  {label:'ახალი',value:stats?.new??'—'},
  {label:'დაკავშირებული',value:stats?.contacted??'—'},
  {label:'დაგეგმილი',value:stats?.scheduled??'—'}
 ];
 return <section className="jmc-admin-dashboard">
  <p className="eyebrow">JMC / Dashboard</p>
  <h1>გამარჯობა, {user.display_name}</h1>
  <p className="jmc-admin-description">გაყიდვების განაცხადები და JMC Georgia-ს ოპერაციული მართვა ერთ სივრცეში.</p>
  {user.role!=='editor'&&<>
   <div className="jmc-admin-metrics">{cards.map(c=><div key={c.label}><strong>{c.value}</strong><span>{c.label}</span></div>)}</div>
   <article className="jmc-admin-feature-card"><div><p className="eyebrow">Sales / Test Drive</p><h2>Lead Management</h2>
     <p>ნახე ახალი მოთხოვნები, დაამუშავე ლიდები და დააფიქსირე სტატუსები. Email არ არის საჭირო.</p></div>
     <Link href="/admin/leads" className="button">ლიდების ნახვა ↗</Link>
   </article>
  </>}
  <div className="jmc-admin-coming-soon"><h2>CMS-ის განვითარების გზა</h2>
   <p>მომდევნო მოდულები: ავტომობილების კატალოგის მართვა, საიტის კონტენტი და Zoho CRM-ის ავტომატური სინქრონიზაცია.</p></div>
 </section>;
}
