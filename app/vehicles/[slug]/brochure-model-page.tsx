import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import type {Vehicle,Feature} from '../../../lib/vehicles';
import {ModelLocalNavigation,ModelSectionHeading,ModelClosingCTA} from './model-sections';
import {BrochureStory,type EditorialScene,type EditorialMedia} from './brochure-story';
import {VigusMotion} from './vigus-motion';

export type BrochureModelContent={
 vehicle:Vehicle;intro:string;highlights:readonly EditorialScene[];
 technical:readonly Feature[];
 equipment:{exterior:readonly string[];interior:readonly string[];safety:readonly string[];capability:readonly string[]};
 media:EditorialMedia;
};
const categories=[{key:'exterior',name:'ექსტერიერი'},{key:'interior',name:'ინტერიერი'},{key:'safety',name:'უსაფრთხოება'},{key:'capability',name:'შესაძლებლობები'}] as const;

/** Grand Avenue follows the same visual composition and section rhythm as the approved Vigus page.
 * Vehicle facts and imagery are independent; Vigus remains unchanged.
 */
export function BrochureModelPage({vehicle,highlights,technical,equipment,media}:BrochureModelContent){
 const spec=(label:string)=>technical.find(x=>x.label===label)?.value??'';
 const gallery=[{key:'front',label:'წინა'},{key:'side',label:'გვერდი'},{key:'rear',label:'უკანა'},{key:'detail',label:'დეტალი'}] as const;
 return <><Header/><main className="vigus-experience grand-vigus-page" id="top"><VigusMotion/>
 <ModelLocalNavigation name={vehicle.name} progress items={[
  {id:'story',label:'აღმოაჩინე'},{id:'design',label:'დიზაინი'},
  {id:'technology',label:'შესაძლებლობები'},{id:'trims',label:'კომპლექტაცია'}
 ]}/>
 <section className="vigus-hero" aria-labelledby="grand-title"><div className="container vigus-hero-content">
  <p className="vigus-kicker">JMC / პიკაპი</p>
  <div className="vigus-hero-image vigus-hero-image-editorial"><img src={media.hero} alt="JMC Grand Avenue — მთავარი ფოტო" fetchPriority="high" width={2048} height={1152}/></div>
  <div className="vigus-hero-bottom"><p className="vigus-eyebrow">JMC-ის 4×4 პიკაპი</p>
  <h1 id="grand-title">GRAND AVENUE</h1><p>შესაძლებლობები, რომლებიც გზას სცდება.</p>
  <div className="vigus-hero-actions"><a href="#trims" className="vigus-pill vigus-pill-dark">გაეცანი კომპლექტაციას</a><Link href="/test-drive" className="vigus-pill vigus-pill-light">ტესტ-დრაივის ინფორმაცია ↗</Link></div>
  <a className="vigus-scroll-cue" href="#story">აღმოაჩინე Grand Avenue ↓</a></div>
 </div></section>
 <section className="vigus-quick-specs container" aria-label="ძირითადი მონაცემები" data-vigus-reveal="metrics">
  <div><strong>2.5 <small>L</small></strong><span>დიზელის ძრავა</span></div>
  <div><strong>211 <small>HP</small></strong><span>სიმძლავრე</span></div>
  <div><strong>4×4</strong><span>ამძრავი</span></div>
  <div><strong>235 <small>mm</small></strong><span>კლირენსი</span></div>
 </section>
 <section id="story" className="vigus-story vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="01 / ხასიათი" title={<>შექმნილი რეალური გზებისთვის.</>} description={vehicle.description}/>
  <div className="vigus-story-mosaic" data-vigus-reveal="visual"><figure className="vigus-story-large"><img src={media.capability} alt="Grand Avenue — გზის შესაძლებლობები" loading="lazy"/></figure><figure className="vigus-story-small"><img src={media.exterior} alt="Grand Avenue — ექსტერიერი" loading="lazy"/></figure><div className="vigus-story-note"><span>JMC Grand Avenue</span><p>ძალა და კომფორტი ყოველდღიურობაში.</p></div></div>
 </div></section>
 <section className="vigus-cinema" data-vigus-reveal="visual" aria-label="Grand Avenue ექსტერიერი">
  <img src={media.exterior} alt="Grand Avenue — ექსტერიერის ფართო ფოტო" loading="lazy"/>
  <div className="vigus-cinema-overlay"><span>02 / ექსტერიერი</span><h2>ფორმა, რომელსაც<br/>დანიშნულება აქვს.</h2></div>
 </section>
 <section id="design" className="vigus-highlights vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="დიზაინი და კომფორტი" title="დეტალები, რომლებიც მნიშვნელოვანია."/>
  <BrochureStory model={vehicle.name} scenes={highlights} media={media}/>
 </div></section>
 <section className="vigus-gallery-section vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="გალერეა" title="დეტალები ახლოდან."/>
  <div className="grand-gallery-grid" data-vigus-reveal="visual">{gallery.map((item,i)=><figure key={item.key}>
   <img src={media[item.key]} alt={`JMC Grand Avenue — ${item.label}`} loading="lazy"/>
   <figcaption>{String(i+1).padStart(2,'0')} / {item.label}</figcaption>
  </figure>)}</div>
 </div></section>
 <section id="technology" className="vigus-capabilities vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="შესაძლებლობები" title="შესაძლებლობები, რომლებსაც ეყრდნობი."/>
  <div className="vigus-capabilities-grid" data-vigus-reveal="metrics">
   <div><strong>8AT</strong><span>ავტომატური ტრანსმისია</span></div>
   <div><strong>80 L</strong><span>საწვავის ავზი</span></div>
   <div><strong>3270 mm</strong><span>თვლების ბაზა</span></div>
  </div>
  <div className="grand-specification-grid">{technical.map(f=><div key={f.label}><span>{f.label}</span><strong>{f.value}</strong></div>)}</div>
 </div></section>
 <section id="trims" className="vigus-trims vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="კომპლექტაცია" title="Grand Avenue 4X4 AT GL." description="ტექნიკური მონაცემები და აღჭურვილობა — 2026 წლის ბროშურის მიხედვით."/>
  <div className="vigus-selector" data-vigus-reveal="panel"><div className="vigus-selector-layout">
   <div className="vigus-selector-car"><img src={media.front} alt="Grand Avenue — 4X4 AT GL" loading="lazy"/></div>
   <div className="vigus-selector-details"><p className="vigus-eyebrow">კომპლექტაცია</p><h3>{vehicle.trims[0].name}</h3><p>{vehicle.trims[0].powertrain}</p><div className="vigus-selector-stats">
    <div><span>ტრანსმისია</span><strong>8AT</strong></div><div><span>ამძრავი</span><strong>4×4</strong></div><div><span>კლირენსი</span><strong>{spec('კლირენსი')}</strong></div>
   </div><Link href="/test-drive" className="vigus-pill vigus-pill-dark">ტესტ-დრაივის ინფორმაცია ↗</Link></div>
  </div></div>
  <div className="grand-equipment"><h3>აღჭურვილობა</h3>{categories.map(({key,name})=><details key={key}><summary>{name}<span>{equipment[key].length} ფუნქცია +</span></summary><ul>{equipment[key].map(v=><li key={v}>{v}</li>)}</ul></details>)}</div>
 </div></section>
 <ModelClosingCTA name="Grand Avenue" title="გაიცანი Grand Avenue ახლოდან." description="გაეცანი მოდელის აღჭურვილობასა და ტესტ-დრაივის ინფორმაციას." compareHref="#trims" animated/>
 </main><Footer/></>;
}
