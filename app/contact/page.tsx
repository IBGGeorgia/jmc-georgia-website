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
    <div className="jmc-contact-actions">
     <a className="button" href="https://www.google.com/maps/search/?api=1&amp;query=%E1%83%97%E1%83%91%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%E1%83%98%2C%20%E1%83%91%E1%83%94%E1%83%9A%E1%83%98%E1%83%90%E1%83%A8%E1%83%95%E1%83%98%E1%83%9A%E1%83%98%E1%83%A1%20115" target="_blank" rel="noopener noreferrer">რუკაზე ნახვა <JmcIcon name="arrow-up-right"/></a>
     <Link href="/test-drive" className="jmc-secondary-link">დაჯავშნე Test Drive <JmcIcon name="arrow-up-right"/></Link>
    </div>
   </section>
   <p className="jmc-contact-footnote">საკონტაქტო ტელეფონი და სამუშაო საათები გამოქვეყნდება ოფიციალური ინფორმაციის დადასტურების შემდეგ.</p>
  </main>
  <Footer/>
 </>;
}
