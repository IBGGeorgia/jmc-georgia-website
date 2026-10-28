import {GrandAvenueProConfigurator} from './grand-avenue-pro-configurator';
import {grandAvenueProOriginalMedia as photos} from '../../../lib/grand-avenue-pro-media';
import './grand-avenue-pro-draft.css';
import {proSourceVariants} from '../../../lib/grand-avenue-pro';
/** Unmounted PRO editorial composition. No route, import into public catalogue or fake images.
 * Phase 4 connects verified PRO photographs and publishes only after user approval.
 */
const metrics=[['2.3 L','ძრავის მოცულობა'],['4×4','ამძრავი'],['8AT','ავტომატური ტრანსმისია'],['255 მმ','კლირენსი']];
const story=[
 {index:'01',name:'ექსტერიერი',title:'ფორმა და ფუნქცია.',description:'ავტომობილის დიზაინის დეტალები და ექსტერიერის აღჭურვილობა.',media:'exterior'},
 {index:'02',name:'ინტერიერი',title:'კომფორტი ყოველდღიური გზებისთვის.',description:'სალონის ტექნოლოგიები და კომპლექტაციებზე დამოკიდებული აღჭურვილობა.',media:'cluster'},
 {index:'03',name:'უსაფრთხოება',title:'დამხმარე სისტემები.',description:'უსაფრთხოების ფუნქციები შესაბამისი LX/SLX ვერსიის მიხედვით.',media:'frontDetail'},
 {index:'04',name:'შესაძლებლობები',title:'4×4 შესაძლებლობები.',description:'მართვის რეჟიმები და გამავლობის სისტემები — მხოლოდ დადასტურებული ვერსიებისთვის.',media:'terrainDisplay'},
] as const;
type ProPhotoKey=keyof typeof photos;
function OriginalPhoto({photo,priority=false}:{photo:ProPhotoKey;priority?:boolean}){
 const entry=photos[photo];return <figure className="pro-draft-original-photo"><img src={entry.src} alt={entry.alt} loading={priority?'eager':'lazy'} decoding="async"/><figcaption>{entry.alt}</figcaption></figure>;
}
export function GrandAvenueProDraftPage(){
 return <main className="pro-draft-page">
  <div className="pro-draft-page-notice">შიდა სამუშაო მაკეტი · გამოსაქვეყნებელი არ არის</div>
  <header className="pro-draft-hero pro-draft-wrap" id="pro-top"><p className="pro-draft-kicker">JMC / GRAND AVENUE PRO</p>
   <h1>GRAND AVENUE <span>PRO</span></h1>
   <p>ოთხივე კომპლექტაცია, ორი ძრავის ვარიანტი და დამოუკიდებელი პროდუქტის გამოცდილება.</p>
   <OriginalPhoto photo="hero" priority/>
   <a href="#pro-choose" className="pro-draft-link">აირჩიე ვერსია ↓</a>
  </header>
  <section className="pro-draft-wrap pro-draft-metrics" aria-label="ძირითადი მონაცემები">{metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
  <section className="pro-draft-wrap pro-draft-chapters" id="pro-story"><div className="pro-draft-chapter-heading"><span>01 / დეტალები</span><h2>შექმნილია განსხვავებული გზებისთვის.</h2></div>
   {story.map((item,i)=><article key={item.index} className="pro-draft-editorial"><div className="pro-draft-editorial-copy"><span>{item.index} / {item.name}</span><h3>{item.title}</h3><p>{item.description}</p></div><OriginalPhoto photo={item.media as ProPhotoKey}/></article>)}
  </section>
  <section className="pro-draft-technology pro-draft-wrap"><div className="pro-draft-chapter-heading"><span>02 / ტექნოლოგიები</span><h2>ინფორმაცია შენს წინაშე.</h2><p>სალონის ფართო ფოტოს ნაცვლად წარმოდგენილია მხოლოდ ორიგინალი ინსტრუმენტების პანელისა და მართვის რეჟიმების კადრები.</p></div><div className="pro-draft-tech-grid"><OriginalPhoto photo="cluster"/><OriginalPhoto photo="terrainDisplay"/></div></section>
  <section className="pro-draft-gallery pro-draft-wrap" id="pro-gallery"><div className="pro-draft-chapter-heading"><span>03 / ვიზუალური გამოცდილება</span><h2>აღმოაჩინე დეტალები.</h2></div><div className="pro-draft-gallery-grid">{(['hero','rear','frontDetail','exterior'] as const).map(photo=><OriginalPhoto key={photo} photo={photo}/>)}</div></section>
  <section className="pro-draft-wrap" id="pro-choose"><GrandAvenueProConfigurator/></section>
  <footer className="pro-draft-footer pro-draft-wrap"><span>JMC Grand Avenue PRO</span><p>ვიზუალური დამტკიცებისა და ფოტოების შემოწმების შემდეგ დაემატება საიტის საერთო Test Drive CTA.</p><p>მოდელის მონაცემები: {proSourceVariants.length} დოკუმენტირებული ვერსია.</p></footer>
 </main>;
}
