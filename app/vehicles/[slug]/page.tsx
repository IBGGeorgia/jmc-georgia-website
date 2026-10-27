import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import {getVehicle,vehicles} from '../../../lib/vehicles';
import {TrimComparison} from './trim-comparison';
import {VigusGallery} from './vigus-gallery';
import {VigusViewer,VigusHighlights,VigusTrimSelector} from './vigus-experience';
export function generateStaticParams(){return vehicles.map(v=>({slug:v.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const v=getVehicle(slug);return {title:v?`JMC ${v.name}`:'მოდელი ვერ მოიძებნა',description:v?.description};
}
const shot=(name:string)=>`/images/vigus/${name}.webp`;
export default async function VehiclePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const vehicle=getVehicle(slug);if(!vehicle)notFound();
 if(slug!=='vigus')return <><Header/><main className="container section"><h1>{vehicle.name}</h1><p>{vehicle.description}</p><TrimComparison trims={vehicle.trims}/></main><Footer/></>;
 return <><Header/><main className="vigus-experience" id="top">
 <nav className="vigus-local-nav" aria-label="Vigus-ის გვერდის ნავიგაცია"><div className="container vigus-local-inner"><a href="#top" className="vigus-local-title">VIGUS</a><div><a href="#story">აღმოაჩინე</a><a href="#design">დიზაინი</a><a href="#technology">შესაძლებლობები</a><a href="#trims">კომპლექტაციები</a></div><Link href="/contact" className="vigus-local-cta">ინფორმაციის მიღება ↗</Link></div></nav>
 <section className="vigus-hero" aria-labelledby="vigus-title"><div className="container vigus-hero-content">
 <p className="vigus-kicker">JMC / PICKUP</p>
 <div className="vigus-hero-image vigus-hero-image-editorial"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_202436_76cc31c1-2daf-46c4-b7b6-0e9870be3e28.png" alt="JMC Vigus — ვერცხლისფერი პიკაპი პრემიუმ არქიტექტურულ სტუდიაში" fetchPriority="high" width="2048" height="1152"/></div>
 <div className="vigus-hero-bottom"><p className="vigus-eyebrow">THE NEW JMC PICKUP</p><h1 id="vigus-title">VIGUS</h1><p>მეტი შესაძლებლობა ყოველ გზაზე.</p><div className="vigus-hero-actions"><Link href="/test-drive" className="vigus-pill vigus-pill-dark">ტესტ-დრაივი ↗</Link><a href="#trims" className="vigus-pill vigus-pill-light">შეადარე კომპლექტაციები</a></div><a className="vigus-scroll-cue" href="#story" aria-label="ქვემოთ გადასვლა">აღმოაჩინე Vigus <span aria-hidden="true">↓</span></a></div>
 </div></section>
 <section className="vigus-quick-specs container" aria-label="ძირითადი მონაცემები"><div><strong>2.5 <small>L</small></strong><span>დიზელის ძრავა</span></div><div><strong>167 <small>HP</small></strong><span>სიმძლავრე</span></div><div><strong>4×4</strong><span>ამძრავი</span></div><div><strong>210 <small>mm</small></strong><span>კლირენსი</span></div></section>
 <section id="story" className="vigus-story vigus-section"><div className="container"><div className="vigus-section-heading"><span className="vigus-eyebrow">01 / CHARACTER</span><h2>შენი გზა.<br/>შენი შესაძლებლობები.</h2><p>Vigus აერთიანებს პიკაპის პრაქტიკულობას, ოთხივე წამყვანი თვლის შესაძლებლობას და ყოველდღიური გადაადგილებისთვის საჭირო კომფორტს.</p></div>
 <div className="vigus-story-mosaic"><figure className="vigus-story-large"><img src={shot('adventure-1')} alt="JMC Vigus მთიან გარემოში" loading="lazy"/></figure><figure className="vigus-story-small"><img src={shot('adventure-4')} alt="JMC Vigus ბუნებრივ ლანდშაფტში" loading="lazy"/></figure><div className="vigus-story-note"><span>JMC VIGUS</span><p>მზადაა სამუშაო დღისთვის. მზადაა გზისთვის.</p></div></div></div></section>
 <section className="vigus-cinema" aria-label="Vigus-ის ექსტერიერი"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_203758_815381dd-8adf-4a4a-b753-c39fc1654c4b.png" alt="JMC Vigus — არქიტექტურულ გარემოში, მთიანი ლანდშაფტის ფონზე" loading="lazy"/><div className="vigus-cinema-overlay"><span>02 / EXTERIOR</span><h2>ფორმა, რომელსაც<br/>დანიშნულება აქვს.</h2></div></section>
 <section id="design" className="vigus-highlights vigus-section"><div className="container"><div className="vigus-section-heading"><span className="vigus-eyebrow">DESIGN & COMFORT</span><h2>დეტალები, რომლებიც მნიშვნელოვანია.</h2></div><VigusHighlights/></div></section>
 <section className="vigus-gallery-section vigus-section"><div className="container"><div className="vigus-section-heading"><span className="vigus-eyebrow">EXPLORE VIGUS</span><h2>აღმოაჩინე ყველა რაკურსი.</h2></div><VigusGallery/></div></section>
 <section className="vigus-viewer-section vigus-section"><div className="container"><div className="vigus-section-heading"><span className="vigus-eyebrow">EXPLORE / VIEW SELECTOR</span><h2>ნახე Vigus ყველა მხრიდან.</h2><p>გადართე არსებული რეალური რაკურსები მაუსით, თითით ან ისრებით.</p></div><VigusViewer/></div></section>
 <section id="technology" className="vigus-capabilities vigus-section"><div className="container"><div className="vigus-section-heading"><span className="vigus-eyebrow">CAPABILITY</span><h2>შესაძლებლობები, რომლებსაც ეყრდნობი.</h2><p>Vigus ხელმისაწვდომია ორი ტრანსმისიის ვარიანტით — 8-საფეხურიანი ავტომატური და 6-საფეხურიანი მექანიკური.</p></div><div className="vigus-capabilities-grid"><div><strong>8AT / 6MT</strong><span>ტრანსმისიის არჩევანი</span></div><div><strong>75 L</strong><span>საწვავის ავზი</span></div><div><strong>3150 mm</strong><span>თვლების ბაზა</span></div></div></div></section>
 <section id="trims" className="vigus-trims vigus-section"><div className="container"><div className="vigus-section-heading"><span className="vigus-eyebrow">CHOOSE YOUR VIGUS</span><h2>რომელი Vigus შეეფერება შენს გეგმებს?</h2><p>ორი კომპლექტაცია. შეადარე ტექნიკური მონაცემები და შეარჩიე შენთვის შესაბამისი ტრანსმისია.</p></div><VigusTrimSelector trims={vehicle.trims}/><div className="vigus-comparison"><h3>დეტალური შედარება</h3><TrimComparison trims={vehicle.trims}/></div></div></section>
 <section className="vigus-final"><div className="container"><span className="vigus-eyebrow">JMC GEORGIA</span><h2>გაიცანი Vigus ახლოდან.</h2><p>დაგვიკავშირდი ხელმისაწვდომობის, პირობებისა და ტესტ-დრაივის შესახებ ინფორმაციისთვის.</p><div><Link href="/test-drive" className="vigus-pill vigus-pill-white">ტესტ-დრაივი ↗</Link><Link href="/contact" className="vigus-pill vigus-pill-outline">ინფორმაციის მოთხოვნა</Link></div></div></section>
 </main><Footer/></>;
}
