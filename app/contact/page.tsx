import type { Metadata } from 'next';
import { Header, Footer } from '../site-components';

export const metadata: Metadata = { title: 'კონტაქტი' };

export default function Contact() {
 return <>
  <Header/>
  <main className="container jmc-contact-page">
   <div className="page-head">
    <p className="eyebrow">დაგვიკავშირდი</p>
    <h1>კონტაქტი</h1>
    <p className="muted">JMC Georgia-ს მისამართი თბილისში.</p>
   </div>
   <section className="jmc-contact-location" aria-labelledby="contact-location-title">
    <div>
     <p className="jmc-contact-location-label">მისამართი</p>
     <h2 id="contact-location-title"><address>თბილისი, ბელიაშვილის 115</address></h2>
    </div>
    <p className="jmc-contact-location-note">ტელეფონი და სამუშაო საათები დაემატება ინფორმაციის დადასტურების შემდეგ.</p>
   </section>
  </main>
  <Footer/>
 </>;
}
