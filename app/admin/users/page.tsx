import {redirect} from 'next/navigation';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {CMSUsers} from './users-client';
export const dynamic='force-dynamic';
export default async function CMSUsersPage(){
 const user=await currentCMSUser();
 if(!user)redirect('/admin');
 if(user.role!=='admin')return <section><h1>წვდომა შეზღუდულია</h1>
  <p>მომხმარებლების მართვა მხოლოდ ადმინისტრატორისთვისაა ხელმისაწვდომი.</p></section>;
 return <section className="jmc-admin-users-page"><p className="eyebrow">Workspace / Administration</p>
  <h1>მომხმარებლები და უფლებები</h1>
  <p className="jmc-admin-description">მართე გუნდების ანგარიშები, წვდომის დონეები და ავტორიზაცია ერთი დაცული სივრციდან.</p>
  <CMSUsers actorId={user.id}/>
 </section>;
}
