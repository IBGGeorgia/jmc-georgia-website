import type { Metadata } from 'next';
import { Header, Footer } from '../site-components';
import {JmcIcon} from '../jmc-icons';
import Link from 'next/link';

export const metadata: Metadata = { title: 'კონტაქტი' };

export default function Contact() {
 return <>
  <Header/>
  <main className="container jmc-contact-page">
   <header className="page-head jmc-page-intro">
    <p className="eyebrow">დაგვიკავშირდი</p>
    <h1>კონტაქტი</h1>
    <p className="jmc-page-lead">JMC Georgia-ს მისამართი თბილისში.</p>
   </header>
   <section className="jmc-contact-location" aria-labelledby="contact-location-title">
    <div>
     <h2 id="contact-location-title" className="jmc-contact-location-label">მისამართი</h2>
     <address className="jmc-contact-location-address">თბილისი, ბელიაშვილის 115</address>
    </div>
    <p className="jmc-contact-location-note">ტელეფონი და სამუშაო საათები დაემატება ინფორმაციის დადასტურების შემდეგ.</p>
   </section>
   <p className="jmc-contact-footnote">საკონტაქტო ტელეფონი და სამუშაო საათები გამოქვეყნდება ოფიციალური ინფორმაციის დადასტურების შემდეგ.</p>
  </main>
  <Footer/>
 </>;
}
