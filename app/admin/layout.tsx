import type {Metadata} from 'next';
import Link from 'next/link';
import {currentCMSUser} from '../../lib/lead-manager-auth';
import '../lead-manager/lead-manager.css';
import './admin.css';
export const dynamic='force-dynamic';
export const metadata:Metadata={title:'JMC Admin',robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){
 const user=await currentCMSUser();
 return <div className="jmc-admin-root">
  <header className="jmc-admin-top">
   <Link href="/admin" className="jmc-admin-brand" aria-label="JMC Admin მთავარი">JMC <span>Admin</span></Link>
   <div className="jmc-admin-top-right"><span>Eastgate Automotive LLC</span><Link href="/">საიტზე გადასვლა ↗</Link></div>
  </header>
  <div className={user?'jmc-admin-workspace':'jmc-admin-workspace jmc-admin-guest'}>
   {user&&<nav className="jmc-admin-sidebar" aria-label="JMC ადმინისტრაციის მენიუ">
    <p className="jmc-admin-menu-eyebrow">Workspace</p>
    <Link href="/admin">მიმოხილვა</Link>
    {user.role!=='editor'&&<Link href="/admin/leads">Test Drive ლიდები</Link>}
    <Link href="/admin/settings">სისტემის სტატუსი</Link>
    <div className="jmc-admin-menu-future">
     <p>შემდეგი მოდულები</p>
     <span>მოდელების მართვა</span><span>საიტის კონტენტი</span><span>Zoho ინტეგრაცია</span>
    </div>
    <p className="jmc-admin-menu-user">{user.display_name}<small>{user.role}</small></p>
   </nav>}
   <main className="jmc-admin-main">{children}</main>
  </div>
 </div>;
}
