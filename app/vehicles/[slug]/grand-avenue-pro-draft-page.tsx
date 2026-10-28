import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import {GrandAvenueProConfigurator} from './grand-avenue-pro-configurator';
import {GrandAvenueProGallery} from './grand-avenue-pro-gallery';
import {grandAvenueProOriginalMedia as photos} from '../../../lib/grand-avenue-pro-media';
import './grand-avenue-pro-draft.css';
import {proSourceVariants} from '../../../lib/grand-avenue-pro';
/** Unmounted PRO editorial composition. No route, import into public catalogue or fake images.
 * Phase 4 connects verified PRO photographs and publishes only after user approval.
 */
const metrics=[['2.3 L','ძრავის მოცულობა'],['4×4','ამძრავი'],['8AT','ავტომატური ტრანსმისია'],['255 მმ','კლირენსი']];
const story=[
 {index:'01',name:'ექსტერიერი',title:'ფორმა და ფუნქცია.',description:'ავტომობილის დიზაინის დეტალები და ექსტერიერის აღჭურვილობა.',media:'exterior'},
 {index:'02',name:'დიზაინის დეტალები',title:'დეტალები ახლოდან.',description:'ფარი, გრილი და ბორბალი — ორიგინალი ფოტოთი, შეუცვლელი ავტომობილის პროპორციებით.',media:'frontDetail'},
 {index:'03',name:'შესაძლებლობები',title:'4×4 შესაძლებლობები.',description:'მართვის რეჟიმები და გამავლობის სისტემები — შესაბამისი ვერსიის აღწერით ქვემოთ.',media:'rear'},
] as const;
type ProPhotoKey=keyof typeof photos;
function OriginalPhoto({photo,priority=false}:{photo:ProPhotoKey;priority?:boolean}){
 const entry=photos[photo];return <figure className="pro-draft-original-photo"><img src={entry.src} alt={entry.alt} loading={priority?'eager':'lazy'} decoding="async"/><figcaption>{entry.alt}</figcaption></figure>;
}
export function GrandAvenueProDraftPage(){
 return <><Header/><main className="pro-draft-page">

  <header className="pro-draft-hero" id="pro-top">
   <div className="pro-premium-hero-photo"><OriginalPhoto photo="hero" priority/><div className="pro-premium-hero-shade"/></div>
   <div className="pro-premium-hero-content pro-draft-wrap"><p className="pro-premium-overline">JMC / PROFESSIONAL PICKUP SERIES</p>
    <h1>GRAND AVENUE <em>PRO</em></h1>
    <p>ყველა გზა ახალი შესაძლებლობაა.</p>
    <div className="pro-premium-hero-actions"><a href="#pro-choose" className="pro-premium-primary">აღმოაჩინე კომპლექტაციები <span aria-hidden="true">↗</span></a><a href="#pro-story" className="pro-premium-secondary">გაიცანი PRO ↓</a></div>
   </div>
   <div className="pro-premium-hero-index">01 / GRAND AVENUE PRO</div>
  </header>
  <section className="pro-draft-wrap pro-draft-metrics" aria-label="ძირითადი მონაცემები">{metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
  <section className="pro-premium-intro pro-draft-wrap" id="pro-story"><div className="pro-premium-intro-copy"><span className="pro-draft-kicker">01 / ხასიათი</span><h2>იქ, სადაც გზა <span>აღარ არის ჩვეულებრივი.</span></h2><p>Grand Avenue PRO აერთიანებს 4×4 შესაძლებლობებს, ავტომატურ ტრანსმისიას და ოთხ განსხვავებულ ვერსიას.</p></div>
   <div className="pro-premium-mosaic"><div className="pro-premium-mosaic-main"><OriginalPhoto photo="exterior"/></div><div className="pro-premium-mosaic-side"><OriginalPhoto photo="rear"/><div className="pro-premium-mosaic-note"><span>JMC / PRO</span><strong>შექმნილი განსხვავებული გზებისთვის.</strong></div></div></div>
  </section>
  <section className="pro-premium-cinema"><OriginalPhoto photo="frontDetail"/><div className="pro-premium-cinema-shade"/><div className="pro-premium-cinema-copy pro-draft-wrap"><span>02 / დიზაინი</span><h2>დეტალები,<br/>რომლებიც გამოარჩევს.</h2></div></section>
  <section className="pro-draft-technology pro-draft-wrap"><div className="pro-draft-chapter-heading"><span>03 / ტექნოლოგიები</span><h2>ინფორმაცია შენს წინაშე.</h2><p>ციფრული ინსტრუმენტების პანელი და გამავლობის რეჟიმების ვიზუალური ინფორმაცია.</p></div><div className="pro-draft-tech-grid"><OriginalPhoto photo="cluster"/><OriginalPhoto photo="terrainDisplay"/></div></section>
  <section className="pro-draft-gallery pro-draft-wrap" id="pro-gallery"><div className="pro-draft-chapter-heading"><span>04 / გალერეა</span><h2>აღმოაჩინე დეტალები.</h2></div><GrandAvenueProGallery/></section>
  <section className="pro-draft-wrap pro-premium-choose" id="pro-choose"><GrandAvenueProConfigurator/></section>
  <footer className="pro-draft-footer pro-draft-wrap"><span>JMC Grand Avenue PRO</span><p>გაეცანი ოთხივე კომპლექტაციას და დაგეგმე შემდეგი ნაბიჯი.</p><Link href="/test-drive" className="pro-premium-primary pro-premium-footer-cta">ტესტ-დრაივის ინფორმაცია ↗</Link></footer>
 </main><Footer/></>;
}
