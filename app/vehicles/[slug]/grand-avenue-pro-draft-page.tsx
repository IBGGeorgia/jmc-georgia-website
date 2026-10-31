import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import {ProPageNavigation} from './pro-page-navigation';
import {GrandAvenueProConfigurator} from './grand-avenue-pro-configurator';
import {GrandAvenueProGallery} from './grand-avenue-pro-gallery';
import {grandAvenueProOriginalMedia as photos} from '../../../lib/grand-avenue-pro-media';
import './grand-avenue-pro-draft.css';
import {proSourceVariants} from '../../../lib/grand-avenue-pro';
/** Approved public PRO editorial, with experimental design changes isolated to preview branch. */
const metrics=[['2.3 ლ','ძრავის მოცულობა'],['4×4','ამძრავი'],['8AT','ავტომატური ტრანსმისია'],['255 მმ','კლირენსი']];
type ProPhotoKey=keyof typeof photos;
function OriginalPhoto({photo,priority=false}:{photo:ProPhotoKey;priority?:boolean}){
 const entry=photos[photo];return <figure className="pro-draft-original-photo"><img src={entry.src} alt={entry.alt} loading={priority?'eager':'lazy'} decoding="async"/><figcaption>{entry.alt}</figcaption></figure>;
}
export function GrandAvenueProDraftPage(){
 return <><Header/><main className="pro-draft-page"><ProPageNavigation/>

  <header className="pro-draft-hero" id="pro-top">
   <div className="pro-premium-hero-photo"><OriginalPhoto photo="hero" priority/><div className="pro-premium-hero-shade"/></div>
   <div className="pro-premium-hero-content pro-draft-wrap"><p className="pro-premium-overline">JMC / პიკაპების სერია</p>
    <h1>Grand Avenue <em>PRO</em></h1>
    <p>4×4 შესაძლებლობები, კომფორტი და ოთხი კომპლექტაცია.</p>
    <div className="pro-premium-hero-actions"><a href="#pro-choose" className="pro-premium-primary">ნახე კომპლექტაციები <span aria-hidden="true">↗</span></a><a href="#pro-story" className="pro-premium-secondary">დაათვალიერე დეტალები ↓</a></div>
   </div>
   <div className="pro-premium-hero-index">01 / Grand Avenue PRO</div>
  </header>
  <section className="pro-draft-wrap pro-draft-metrics" aria-label="ძირითადი მონაცემები">{metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
  <section className="pro-premium-intro pro-draft-wrap" id="pro-story"><div className="pro-premium-intro-copy"><span className="pro-draft-kicker">01 / ხასიათი</span><h2>სხვადასხვა გზა. <span>ერთი PRO.</span></h2><p>Grand Avenue PRO წარმოდგენილია LX და SLX კომპლექტაციებით, დიზელისა და ბენზინის ძრავებით. აირჩიე შენთვის შესაფერისი ვარიანტი.</p></div>
   <div className="pro-premium-mosaic"><div className="pro-premium-mosaic-main"><OriginalPhoto photo="exterior"/></div><div className="pro-premium-mosaic-side"><OriginalPhoto photo="overhead"/><div className="pro-premium-mosaic-note"><span>JMC / PRO</span><strong>დიზაინი და პრაქტიკული დეტალები.</strong></div></div></div>
  </section>
  <section className="pro-premium-cinema"><OriginalPhoto photo="rear"/><div className="pro-premium-cinema-shade"/><div className="pro-premium-cinema-copy pro-draft-wrap"><span>02 / დიზაინი</span><h2>დიზაინი,<br/>რომელიც გამოარჩევს.</h2></div></section>
  <section className="pro-draft-technology pro-draft-wrap"><div className="pro-draft-chapter-heading"><span>03 / ტექნოლოგიები</span><h2>ტექნოლოგიები სალონში.</h2><p>ინსტრუმენტების ციფრული პანელი და მართვის რეჟიმების ინფორმაცია.</p></div><div className="pro-draft-tech-grid"><OriginalPhoto photo="cluster"/><OriginalPhoto photo="terrainDisplay"/></div></section>
  <section className="pro-draft-gallery pro-draft-wrap" id="pro-gallery"><div className="pro-draft-chapter-heading"><span>04 / ყველა რაკურსი</span><h2>აღმოაჩინე დეტალები.</h2></div><GrandAvenueProGallery/></section>
  <section className="pro-draft-wrap pro-premium-choose" id="pro-choose"><GrandAvenueProConfigurator/></section>
  <footer className="pro-draft-footer pro-draft-wrap"><span>JMC Grand Avenue PRO</span><p>შეადარე ოთხი ვერსიის მახასიათებლები და გაეცანი ტესტ-დრაივის პირობებს.</p><Link href="/test-drive" className="pro-premium-primary pro-premium-footer-cta">ტესტ-დრაივის ინფორმაცია ↗</Link></footer>
 </main><Footer/></>;
}
