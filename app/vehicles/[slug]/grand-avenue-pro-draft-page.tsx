import {GrandAvenueProConfigurator} from './grand-avenue-pro-configurator';
import {proSourceVariants} from '../../../lib/grand-avenue-pro';
/** Unmounted PRO editorial composition. No route, import into public catalogue or fake images.
 * Phase 4 connects verified PRO photographs and publishes only after user approval.
 */
const metrics=[['2.3 L','ძრავის მოცულობა'],['4×4','ამძრავი'],['8AT','ავტომატური ტრანსმისია'],['255 მმ','კლირენსი']];
const story=[
 {index:'01',name:'ექსტერიერი',title:'ფორმა და ფუნქცია.',description:'ავტომობილის დიზაინის დეტალები და ექსტერიერის აღჭურვილობა.',media:'Exterior / PRO photo required'},
 {index:'02',name:'ინტერიერი',title:'კომფორტი ყოველდღიური გზებისთვის.',description:'სალონის ტექნოლოგიები და კომპლექტაციებზე დამოკიდებული აღჭურვილობა.',media:'Interior / PRO photo required'},
 {index:'03',name:'უსაფრთხოება',title:'დამხმარე სისტემები.',description:'უსაფრთხოების ფუნქციები შესაბამისი LX/SLX ვერსიის მიხედვით.',media:'Safety / PRO photo required'},
 {index:'04',name:'შესაძლებლობები',title:'4×4 შესაძლებლობები.',description:'მართვის რეჟიმები და გამავლობის სისტემები — მხოლოდ დადასტურებული ვერსიებისთვის.',media:'Capability / PRO photo required'},
] as const;
function MediaSlot({label,kind}:{label:string;kind?:string}){return <div className="pro-draft-media" aria-label={label+' — ფოტოს ადგილი ჯერ არ არის შევსებული'}><span>PHOTO SLOT / {kind??'PRO'}</span><strong>{label}</strong><small>მხოლოდ Grand Avenue PRO-ის დადასტურებული ფოტო</small></div>}
export function GrandAvenueProDraftPage(){
 return <main className="pro-draft-page">
  <div className="pro-draft-page-notice">შიდა სამუშაო მაკეტი · გამოსაქვეყნებელი არ არის</div>
  <header className="pro-draft-hero pro-draft-wrap" id="pro-top"><p className="pro-draft-kicker">JMC / GRAND AVENUE PRO</p>
   <h1>GRAND AVENUE <span>PRO</span></h1>
   <p>ოთხივე კომპლექტაცია, ორი ძრავის ვარიანტი და დამოუკიდებელი პროდუქტის გამოცდილება.</p>
   <MediaSlot label="მთავარი ავტომობილის ფოტო" kind="HERO"/>
   <a href="#pro-choose" className="pro-draft-link">აირჩიე ვერსია ↓</a>
  </header>
  <section className="pro-draft-wrap pro-draft-metrics" aria-label="ძირითადი მონაცემები">{metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
  <section className="pro-draft-wrap pro-draft-chapters" id="pro-story"><div className="pro-draft-chapter-heading"><span>01 / დეტალები</span><h2>შექმნილია განსხვავებული გზებისთვის.</h2></div>
   {story.map((item,i)=><article key={item.index} className="pro-draft-editorial"><div className="pro-draft-editorial-copy"><span>{item.index} / {item.name}</span><h3>{item.title}</h3><p>{item.description}</p></div><MediaSlot label={item.name+' — ფოტო'} kind={i===0?'WIDE':item.media}/></article>)}
  </section>
  <section className="pro-draft-gallery pro-draft-wrap" id="pro-gallery"><div className="pro-draft-chapter-heading"><span>02 / ვიზუალური გამოცდილება</span><h2>აღმოაჩინე დეტალები.</h2></div><div className="pro-draft-gallery-grid">{['წინა ¾','გვერდი','უკანა ¾','დეტალი'].map(label=><MediaSlot key={label} label={label}/>)}</div></section>
  <section className="pro-draft-wrap" id="pro-choose"><GrandAvenueProConfigurator/></section>
  <footer className="pro-draft-footer pro-draft-wrap"><span>JMC Grand Avenue PRO</span><p>ვიზუალური დამტკიცებისა და ფოტოების შემოწმების შემდეგ დაემატება საიტის საერთო Test Drive CTA.</p><p>მოდელის მონაცემები: {proSourceVariants.length} დოკუმენტირებული ვერსია.</p></footer>
 </main>;
}
