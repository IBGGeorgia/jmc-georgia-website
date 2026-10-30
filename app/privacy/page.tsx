import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../site-components';

export const metadata:Metadata={
 title:'კონფიდენციალურობა',
 description:'JMC Georgia — კონფიდენციალურობის პოლიტიკის გამოქვეყნების მიმდინარე სტატუსი.'
};

export default function Privacy(){
 return <>
  <Header/>
  <main className="container jmc-info-page jmc-privacy-page">
   <header className="page-head jmc-page-intro">
    <p className="eyebrow">JMC Georgia</p>
    <h1>კონფიდენციალურობა</h1>
    <p className="jmc-page-lead">ინფორმაცია კონფიდენციალურობის პოლიტიკის შესახებ.</p>
   </header>
   <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-status-title">
    <div className="jmc-info-panel-copy">
     <p className="jmc-info-eyebrow">დოკუმენტის სტატუსი</p>
     <h2 id="privacy-status-title">პოლიტიკა მზადდება</h2>
     <p>მონაცემთა დამუშავებისთვის პასუხისმგებელი იურიდიული პირის ოფიციალური რეკვიზიტები გამოქვეყნდება პოლიტიკის საბოლოო დამტკიცებისთანავე.</p>
     <p>საიტის კონფიდენციალურობის ოფიციალური პოლიტიკის საბოლოო იურიდიული და ტექნიკური დამტკიცება მიმდინარეობს. ტესტ-დრაივის ონლაინ განაცხადები ამ ეტაპზე არ მიიღება.</p>
     <p>პერსონალურ მონაცემებთან დაკავშირებული მოთხოვნებისა და მარკეტინგულ კომუნიკაციაზე უარის საკითხებზე დაგვიკავშირდი: <a href="mailto:compliance@ibg.ge">compliance@ibg.ge</a>.</p>
     <p>პოლიტიკის სრული ტექსტი გამოქვეყნდება მონაცემების შეგროვების ფუნქციის გააქტიურებამდე.</p>
     <div className="jmc-info-actions">
      <Link href="/" className="button">მთავარ გვერდზე დაბრუნება <span aria-hidden="true">↗</span></Link>
     </div>
    </div>
   </section>
  </main>
  <Footer/>
 </>;
}
