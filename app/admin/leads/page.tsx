import {redirect} from 'next/navigation';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {LeadManagerClient} from '../../lead-manager/lead-manager-client';
export const dynamic='force-dynamic';
export default async function AdminLeads(){
 const user=await currentCMSUser();
 if(!user)redirect('/admin');
 if(user.role==='editor')return <section><h1>წვდომა შეზღუდულია</h1><p>ლიდების მოდულზე ნებართვა არ გაქვს.</p></section>;
 return <section className="jmc-admin-leads">
  <p className="eyebrow">Sales / Leads</p><h1>Test Drive ლიდები</h1>
  <LeadManagerClient role={user.role}/>
 </section>;
}
