import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import type {Vehicle} from '../../../lib/vehicles';
import {TrimComparison} from './trim-comparison';
import {VigusGallery} from './vigus-gallery';
import {VigusViewer,VigusHighlights,VigusTrimSelector} from './vigus-experience';
import {VigusMotion} from './vigus-motion';
import {ModelLocalNavigation,ModelSectionHeading,ModelClosingCTA} from './model-sections';

/** Approved Vigus-specific editorial composition. Shared elements are model-agnostic. */
export function VigusPage({vehicle}:{vehicle:Vehicle}){
 return <><Header/><main className="vigus-experience" id="top"><VigusMotion/>
 <ModelLocalNavigation name="VIGUS" progress items={[
  {id:'story',label:'აღმოაჩინე'},
  {id:'design',label:'დიზაინი'},
  {id:'technology',label:'შესაძლებლობები'},
  {id:'trims',label:'კომპლექტაციები'}
 ]}/>
 <section className="vigus-hero" aria-labelledby="vigus-title"><div className="container vigus-hero-content">
 <p className="vigus-kicker">JMC / პიკაპი</p>
 <div className="vigus-hero-image vigus-hero-image-editorial"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_202436_76cc31c1-2daf-46c4-b7b6-0e9870be3e28.png" alt="JMC Vigus — ვერცხლისფერი პიკაპი პრემიუმ არქიტექტურულ სტუდიაში" fetchPriority="high" width="2048" height="1152"/></div>
 <div className="vigus-hero-bottom"><p className="vigus-eyebrow">JMC-ის პიკაპი</p><h1 id="vigus-title">VIGUS</h1><p>მეტი შესაძლებლობა ყოველ გზაზე.</p><div className="vigus-hero-actions"><a href="#trims" className="vigus-pill vigus-pill-dark">შეადარე კომპლექტაციები</a><Link href="/contact" className="vigus-pill vigus-pill-light">მისამართის ნახვა <span aria-hidden="true">↗</span></Link></div><a className="vigus-scroll-cue" href="#story" aria-label="ქვემოთ გადასვლა">აღმოაჩინე Vigus <span aria-hidden="true">↓</span></a></div>
 </div></section>
 <section className="vigus-quick-specs container" data-vigus-reveal="metrics" aria-label="ძირითადი მონაცემები"><div><strong><span data-vigus-count="2.5">2.5</span> <small>L</small></strong><span>დიზელის ძრავა</span></div><div><strong><span data-vigus-count="167">167</span> <small>HP</small></strong><span>სიმძლავრე</span></div><div><strong>4×4</strong><span>ამძრავი</span></div><div><strong><span data-vigus-count="210">210</span> <small>mm</small></strong><span>კლირენსი</span></div></section>
 <section id="story" className="vigus-story vigus-section"><div className="container"><ModelSectionHeading animated eyebrow="01 / ხასიათი" title={<>შენი გზა.<br/>შენი შესაძლებლობები.</>} description="Vigus აერთიანებს პიკაპის პრაქტიკულობას, ოთხივე წამყვანი თვლის შესაძლებლობას და ყოველდღიური გადაადგილებისთვის საჭირო კომფორტს."/>
 <div className="vigus-story-mosaic" data-vigus-reveal="visual"><figure className="vigus-story-large"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_204108_025ab606-f597-4c60-a699-a293afa52d7f.png" alt="JMC Vigus — მთავარი ფოტო მთიან გარემოში" loading="lazy"/></figure><figure className="vigus-story-small"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_204433_ec69e7c2-c6d9-4bd6-bac4-6a2c16ea833c.png" alt="JMC Vigus — უკანა სამი მეოთხედის რაკურსით" loading="lazy"/></figure><div className="vigus-story-note"><span>JMC Vigus</span><p>მზადაა სამუშაო დღისთვის. მზადაა გზისთვის.</p></div></div></div></section>
 <section className="vigus-cinema" data-vigus-reveal="visual" aria-label="Vigus-ის ექსტერიერი"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_203758_815381dd-8adf-4a4a-b753-c39fc1654c4b.png" alt="JMC Vigus — არქიტექტურულ გარემოში, მთიანი ლანდშაფტის ფონზე" loading="lazy"/><div className="vigus-cinema-overlay"><span>02 / ექსტერიერი</span><h2>ფორმა, რომელსაც<br/>დანიშნულება აქვს.</h2></div></section>
 <section id="design" className="vigus-highlights vigus-section"><div className="container"><ModelSectionHeading animated eyebrow="დიზაინი და კომფორტი" title={<>დეტალები, რომლებიც მნიშვნელოვანია.</>}/><VigusHighlights/></div></section>
 <section className="vigus-gallery-section vigus-section"><div className="container"><ModelSectionHeading animated eyebrow="გალერეა" title={<>დეტალები ახლოდან.</>}/><VigusGallery/></div></section>
 <section className="vigus-viewer-section vigus-section"><div className="container"><ModelSectionHeading animated eyebrow="ინტერაქციული რაკურსები" title={<>ოთხი რეალური რაკურსი.</>} description="გადართე ექსტერიერის ფოტოები მაუსით, თითით ან ისრებით."/><VigusViewer/></div></section>
 <section id="technology" className="vigus-capabilities vigus-section"><div className="container"><ModelSectionHeading animated eyebrow="შესაძლებლობები" title={<>შესაძლებლობები, რომლებსაც ეყრდნობი.</>} description="Vigus ხელმისაწვდომია ორი ტრანსმისიის ვარიანტით — 8-საფეხურიანი ავტომატური და 6-საფეხურიანი მექანიკური."/><div className="vigus-capabilities-grid" data-vigus-reveal="metrics"><div><strong>8AT / 6MT</strong><span>ტრანსმისიის არჩევანი</span></div><div><strong><span data-vigus-count="75">75</span> L</strong><span>საწვავის ავზი</span></div><div><strong><span data-vigus-count="3150">3150</span> mm</strong><span>თვლების ბაზა</span></div></div></div></section>
 <section id="trims" className="vigus-trims vigus-section"><div className="container"><ModelSectionHeading animated eyebrow="კომპლექტაციების არჩევა" title={<>რომელი Vigus შეეფერება შენს გეგმებს?</>} description="ორი კომპლექტაცია. შეადარე ტექნიკური მონაცემები და შეარჩიე შენთვის შესაბამისი ტრანსმისია."/><VigusTrimSelector trims={vehicle.trims}/><div className="vigus-comparison" data-vigus-reveal="panel"><h3>დეტალური შედარება</h3><TrimComparison trims={vehicle.trims}/></div></div></section>
 <ModelClosingCTA name="Vigus" title="გაიცანი Vigus ახლოდან."
 description="გაიგე მეტი კომპლექტაციების შესახებ და ნახე JMC Georgia-ს მისამართი თბილისში."
 compareHref="#trims" animated/>
 </main><Footer/></>;
}
