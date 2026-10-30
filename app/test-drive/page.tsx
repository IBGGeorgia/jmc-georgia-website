import './test-drive.css';
import {isTestDriveReady} from '../../lib/test-drive-server';
import {TestDriveForm} from './test-drive-form';
import {JmcIcon} from '../jmc-icons';
import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../site-components';

export const metadata:Metadata={
 title:'Test Drive — JMC Georgia',
 description:'JMC Drive Studio — შეარჩიე VIGUS, Grand Avenue ან Grand Avenue PRO, დაათვალიერე ავტომობილი და მოითხოვე Test Drive თბილისში.'
};
export const dynamic='force-dynamic';

export default async function TestDrive(){
 const ready=await isTestDriveReady();
 return <>
  <Header/>
  <main className="container jmc-test-drive-page">
   <section className="jmc-td-hero" aria-labelledby="jmc-td-hero-title">
    <div className="jmc-td-hero-copy">
     <p className="eyebrow">JMC Georgia / Drive Studio</p>
     <h1 id="jmc-td-hero-title">შეიგრძენი JMC.<br/>საკუთარი გამოცდილებით.</h1>
     <p className="jmc-td-hero-lead">შეარჩიე ავტომობილი, აღმოაჩინე მისი დეტალები და მოითხოვე Test Drive — ყველაფერი ერთ სივრცეში.</p>
     <div className="jmc-td-hero-actions">
      <a className="button jmc-td-hero-primary" href="#test-drive-request">
       დაიწყე არჩევა <JmcIcon name="arrow-up-right"/>
      </a>
      <Link href="/contact" className="jmc-td-text-link">
       შოურუმის მისამართი <JmcIcon name="arrow-up-right"/>
      </Link>
     </div>
    </div>
    <div className="jmc-td-hero-aside" aria-hidden="true">
     <span className="jmc-td-hero-aside-number">03</span>
     <span className="jmc-td-hero-aside-rule"/>
     <p>მოდელი. გამოცდილება. შენი არჩევანი.</p>
     <span className="jmc-td-hero-aside-tag">JMC / DRIVE EXPERIENCE</span>
    </div>
   </section>

   <TestDriveForm ready={ready}/>

   <section className="jmc-td-process" aria-labelledby="jmc-td-process-title">
    <div className="jmc-td-process-heading">
     <p className="eyebrow">Test Drive / შემდეგი ნაბიჯები</p>
     <h2 id="jmc-td-process-title">რა ხდება მოთხოვნის გაგზავნის შემდეგ?</h2>
    </div>
    <div className="jmc-td-process-grid">
     <article><span>01</span><h3>მოთხოვნა მიიღება</h3>
      <p>სისტემა დააფიქსირებს შენს განაცხადს და შერჩეულ მოდელს.</p></article>
     <article><span>02</span><h3>დაგიკავშირდებით</h3>
      <p>გაყიდვების წარმომადგენელი დააზუსტებს დეტალებს.</p></article>
     <article><span>03</span><h3>შევათანხმებთ დროს</h3>
      <p>ტესტ-დრაივის დრო დადასტურდება ჩვენს წარმომადგენელთან.</p></article>
    </div>
   </section>

   <section className="jmc-td-visit" aria-labelledby="jmc-td-visit-title">
    <div>
     <p className="eyebrow">JMC Georgia / Showroom</p>
     <h2 id="jmc-td-visit-title">შეგვხვდი შოურუმში</h2>
     <p>თბილისი, ბელიაშვილის 115</p>
    </div>
    <div className="jmc-td-visit-actions">
     <Link href="/contact" className="button">მისამართის ნახვა <JmcIcon name="arrow-up-right"/></Link>
     <Link href="/vehicles" className="jmc-td-text-link">მოდელების გაცნობა <JmcIcon name="arrow-up-right"/></Link>
    </div>
   </section>
  </main>
  <Footer/>
 </>;
}
