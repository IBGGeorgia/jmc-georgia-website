import {redirect} from 'next/navigation';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {CMSSetup} from './setup-form';
export const dynamic='force-dynamic';
export default async function AdminSetup(){
 if(await currentCMSUser())redirect('/admin');
 return <section className="jmc-cms-setup-page">
  <div><p className="eyebrow">JMC Admin / Secure Initialization</p>
   <h1>პირველი ადმინისტრატორი</h1>
   <p className="jmc-admin-description">ერთჯერადი, დაცული კონფიგურაცია. ამ ეტაპზე შეიქმნება მონაცემთა ბაზის ცხრილები და პირველი ადმინისტრატორის ანგარიში. საჯარო Test Drive განაცხადები არ ჩაირთვება.</p>
  </div>
  <CMSSetup/>
 </section>;
}
