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
     <p>საიტის კონფიდენციალურობის ოფიციალური პოლიტიკა ჯერ არ არის გამოქვეყნებული. ტესტ-დრაივის ონლაინ განაცხადები ამ ეტაპზე არ მიიღება.</p>
     <p>პოლიტიკის სრული ტექსტი დაემატება შესაბამისი ინფორმაციის დადასტურების შემდეგ, მომხმარებლის მონაცემების შეგროვების ფუნქციის გააქტიურებამდე.</p>
     <div className="jmc-info-actions">
      <Link href="/" className="button">მთავარ გვერდზე დაბრუნება <span aria-hidden="true">↗</span></Link>
     </div>
    </div>
   </section>
  </main>
  <Footer/>
 </>;
}
