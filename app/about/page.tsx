import {JmcIcon} from '../jmc-icons';
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
     <p className="jmc-info-eyebrow">01 / მოდელების ხაზი</p>
     <h2 id="about-model-title">სამი მოდელი. განსხვავებული შესაძლებლობები.</h2>
     <p>გაეცანი JMC-ის საქართველოში წარმოდგენილ პიკაპებს, დაათვალიერე მათი დიზაინი და შეადარე ტექნიკური მონაცემები.</p>
     <div className="jmc-info-actions">
      <Link href="/compare" className="button">შეადარე მოდელები <JmcIcon name="arrow-up-right"/></Link>
      <Link href="/test-drive" className="jmc-secondary-link">დაჯავშნე Test Drive <JmcIcon name="arrow-up-right"/></Link>
     </div>
    </div>
    <div className="jmc-info-panel-aside" aria-label="JMC-ის მოდელები საქართველოში">
     <span className="jmc-info-aside-label">JMC / Georgia</span>
     <strong>3 მოდელი</strong>
     <span className="jmc-info-aside-caption">VIGUS · Grand Avenue · Grand Avenue PRO</span>
    </div>
   </section>
   <section className="jmc-about-model-grid" aria-label="JMC-ის მოდელები">
    <Link href="/vehicles/vigus" className="jmc-about-model-card"><span>01 / პიკაპი</span><h2>VIGUS</h2><span>მოდელის ნახვა <JmcIcon name="arrow-up-right"/></span></Link>
    <Link href="/vehicles/grand-avenue" className="jmc-about-model-card"><span>02 / პიკაპი</span><h2>Grand Avenue</h2><span>მოდელის ნახვა <JmcIcon name="arrow-up-right"/></span></Link>
    <Link href="/vehicles/grand-avenue-pro" className="jmc-about-model-card"><span>03 / პიკაპი</span><h2>Grand Avenue PRO</h2><span>მოდელის ნახვა <JmcIcon name="arrow-up-right"/></span></Link>
   </section>
   <section className="jmc-about-contact" aria-labelledby="about-visit-title">
    <div><p className="jmc-info-eyebrow">02 / JMC Georgia</p><h2 id="about-visit-title">გვეწვიე თბილისში</h2><p>თბილისი, ბელიაშვილის 115</p></div>
    <Link href="/contact" className="button">კონტაქტი და მისამართი <JmcIcon name="arrow-up-right"/></Link>
   </section>
  </main>
  <Footer/>
 </>;
}
