import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../site-components';

export const metadata:Metadata={
 title:'ჩვენ შესახებ',
 description:'JMC Georgia — ოფიციალური წარმომადგენლობა საქართველოში და ხელმისაწვდომი მოდელები.'
};

export default function About(){
 return <>
  <Header/>
  <main className="container jmc-info-page jmc-about-page">
   <header className="page-head jmc-page-intro">
    <p className="eyebrow">JMC Georgia</p>
    <h1>ჩვენ შესახებ</h1>
    <p className="jmc-page-lead">JMC-ის ოფიციალური წარმომადგენლობა საქართველოში.</p>
   </header>
   <section className="jmc-info-panel" aria-labelledby="about-model-title">
    <div className="jmc-info-panel-copy">
     <p className="jmc-info-eyebrow">ავტომობილების გაცნობა</p>
     <h2 id="about-model-title">აღმოაჩინე JMC Vigus</h2>
     <p>გაეცანი პიკაპის დიზაინს, ტექნიკურ მახასიათებლებსა და კომპლექტაციების შედარებას ერთ სივრცეში.</p>
     <div className="jmc-info-actions">
      <Link href="/vehicles/vigus" className="button">Vigus-ის დათვალიერება <span aria-hidden="true">↗</span></Link>
      <Link href="/contact" className="jmc-secondary-link">მისამართის ნახვა <span aria-hidden="true">↗</span></Link>
     </div>
    </div>
    <div className="jmc-info-panel-aside" aria-label="JMC-ის მოდელი საქართველოში">
     <span className="jmc-info-aside-label">JMC / Georgia</span>
     <strong>VIGUS</strong>
     <span className="jmc-info-aside-caption">პიკაპი · 4×4</span>
    </div>
   </section>
   <p className="jmc-info-footnote">ბრენდის შესახებ დამატებითი ოფიციალური ინფორმაცია გამოქვეყნდება დამტკიცებული მასალების მიღების შემდეგ.</p>
  </main>
  <Footer/>
 </>;
}
