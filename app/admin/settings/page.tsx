import {redirect} from 'next/navigation';
import {currentCMSUser} from '../../../lib/lead-manager-auth';
import {isAdminReady,isTestDriveReady} from '../../../lib/test-drive-server';
export const dynamic='force-dynamic';
export default async function AdminSettings(){
 const user=await currentCMSUser();if(!user)redirect('/admin');
 return <section className="jmc-admin-settings">
  <p className="eyebrow">Workspace / Settings</p>
  <h1>სისტემის სტატუსი</h1>
  <p>მოდულების მომზადება და ინტეგრაციების მზადყოფნა. უსაფრთხოების პარამეტრები აქ არ გამოჩნდება.</p>
  <div className="jmc-admin-status-grid">
   <article><h2>CMS ავტორიზაცია</h2><strong>{isAdminReady()?'კონფიგურირებულია':'გასამართია'}</strong><p>ინდივიდუალური ანგარიშები და როლები</p></article>
   <article><h2>Test Drive</h2><strong>{isTestDriveReady()?'აქტიურია':'გამორთულია'}</strong><p>რეალური განაცხადების მიღება მხოლოდ მონაცემთა დაცვის პირობების შესრულების შემდეგ</p></article>
   <article><h2>Zoho CRM</h2><strong>მომავალი ინტეგრაცია</strong><p>მზადდება მონაცემების სინქრონიზაციის მოდული</p></article>
   <article><h2>საიტის კონტენტი</h2><strong>მომდევნო ეტაპი</strong><p>მოდელები, ფოტოები, ტექსტები და კამპანიები</p></article>
  </div>
 </section>;
}
