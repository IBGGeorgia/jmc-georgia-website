import './test-drive.css';
import {isTestDriveReady} from '../../lib/test-drive-server';
import {TestDriveForm} from './test-drive-form';
import {studioImageFor} from '../../lib/studio-images';
import {JmcIcon} from '../jmc-icons';
import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../site-components';
import {vehicles} from '../../lib/vehicles';

export const metadata:Metadata={
 title:'Test Drive — JMC Georgia',
 description:'აირჩიე JMC VIGUS, Grand Avenue ან Grand Avenue PRO და გაიგე, როგორ დაგეგმო ტესტ-დრაივი JMC Georgia-სთან თბილისში.'
};
export const dynamic='force-dynamic';

export default function TestDrive(){
 const ready=isTestDriveReady();
 const vehicle=vehicles.find(v=>v.slug==='grand-avenue-pro')??vehicles[0];
 return <>
  <Header/>
  <main className="container jmc-test-drive-page">
   <section className="jmc-td-hero" aria-labelledby="jmc-td-hero-title">
    <div className="jmc-td-hero-copy">
     <p className="eyebrow">JMC Georgia / Test Drive</p>
     <h1 id="jmc-td-hero-title">შეიგრძენი JMC.<br/>საკუთარი გამოცდილებით.</h1>
     <p className="jmc-td-hero-lead">აირჩიე სასურველი პიკაპი, გაეცანი მას ახლოდან და დაგეგმე საცდელი მართვა ჩვენს გუნდთან ერთად.</p>
     <div className="jmc-td-hero-actions">
      <a className="button jmc-td-hero-primary" href="#test-drive-request">
       აირჩიე ავტომობილი <JmcIcon name="arrow-up-right"/>
      </a>
      <Link href="/contact" className="jmc-td-text-link">
       დაგვიკავშირდი <JmcIcon name="arrow-up-right"/>
      </Link>
     </div>
     <p className="jmc-td-hero-caption">
      <span className="jmc-td-hero-dot" aria-hidden="true"/>
      {ready?'ტესტ-დრაივის მოთხოვნის ონლაინ გაგზავნა აქტიურია':'ონლაინ მოთხოვნის ფუნქცია მზადდება'}
     </p>
    </div>
    <div className="jmc-td-hero-visual">
     <img src={studioImageFor(vehicle.slug,vehicle.heroImage)}
      alt="JMC Grand Avenue PRO — პიკაპი Studio გარემოში"
      fetchPriority="high"/>
     <span className="jmc-td-hero-visual-label">GRAND AVENUE PRO <span aria-hidden="true">↗</span></span>
    </div>
   </section>

   <section className="jmc-td-process" aria-labelledby="jmc-td-process-title">
    <div className="jmc-td-process-heading">
     <p className="eyebrow">როგორ მუშაობს</p>
     <h2 id="jmc-td-process-title">სამი მარტივი ნაბიჯი</h2>
    </div>
    <div className="jmc-td-process-grid">
     <article><span>01</span><h3>აირჩიე მოდელი</h3>
      <p>შეარჩიე VIGUS, Grand Avenue ან Grand Avenue PRO.</p></article>
     <article><span>02</span><h3>გამოგვიგზავნე მოთხოვნა</h3>
      <p>დატოვე საკონტაქტო ნომერი და სურვილისამებრ სასურველი დღე.</p></article>
     <article><span>03</span><h3>შევათანხმოთ დრო</h3>
      <p>ჩვენი წარმომადგენელი დაგიკავშირდება საცდელი მართვის დეტალების დასაზუსტებლად.</p></article>
    </div>
   </section>

   <TestDriveForm ready={ready}/>

   <section className="jmc-td-visit" aria-labelledby="jmc-td-visit-title">
    <div>
     <p className="eyebrow">JMC Georgia / Showroom</p>
     <h2 id="jmc-td-visit-title">შეგვხვდი შოურუმში</h2>
     <p>თბილისი, ბელიაშვილის 115</p>
    </div>
    <div className="jmc-td-visit-actions">
     <Link href="/contact" className="button">კონტაქტი და მისამართი <JmcIcon name="arrow-up-right"/></Link>
     <Link href="/vehicles" className="jmc-td-text-link">მოდელების გაცნობა <JmcIcon name="arrow-up-right"/></Link>
    </div>
   </section>
  </main>
  <Footer/>
 </>;
}
