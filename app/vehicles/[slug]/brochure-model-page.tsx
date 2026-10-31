import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import type {Vehicle,Feature} from '../../../lib/vehicles';
import {ModelLocalNavigation,ModelSectionHeading,ModelClosingCTA} from './model-sections';
import {BrochureStory,type EditorialScene,type EditorialMedia} from './brochure-story';
import {VigusMotion} from './vigus-motion';
import {GrandGallery} from './grand-gallery';

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
 const trim=vehicle.trims[0];
 const groups=[
  {name:'ძრავა და შესაძლებლობები',items:technical.slice(0,10)},
  {name:'ზომები და პრაქტიკულობა',items:technical.slice(10)}
 ];
 const gallery=[{key:'front',label:'წინა'},{key:'side',label:'გვერდი'},{key:'rear',label:'უკანა'},{key:'detail',label:'დეტალი'}] as const;
 return <><Header/><main className="vigus-experience grand-vigus-page" id="top"><VigusMotion/>
 <ModelLocalNavigation name={vehicle.name} progress items={[
  {id:'story',label:'აღმოაჩინე'},{id:'design',label:'დიზაინი'},
  {id:'technology',label:'შესაძლებლობები'},{id:'trims',label:'კომპლექტაცია'}
 ]}/>
 <section className="vigus-hero jmc-unified-hero jmc-unified-grand" aria-labelledby="grand-title">
 <div className="vigus-hero-image vigus-hero-image-editorial jmc-unified-hero-image"><img src={media.hero} alt="JMC Grand Avenue - მთავარი ფოტო" fetchPriority="high"/></div>
 <div className="jmc-unified-hero-shade" aria-hidden="true"/>
 <div className="container vigus-hero-content jmc-unified-hero-content"><p className="vigus-kicker">JMC / პიკაპი</p>
 <div className="vigus-hero-bottom"><h1 id="grand-title">Grand Avenue</h1><p>4×4 პიკაპი ყოველდღიური გზებისა და რთული მარშრუტებისთვის.</p><div className="vigus-hero-actions"><a href="#trims" className="vigus-pill vigus-pill-dark">ნახე კომპლექტაცია ↗</a><a href="#story" className="vigus-pill vigus-pill-light">დაათვალიერე დეტალები ↓</a></div></div>
 </div><span className="jmc-unified-hero-index">01 / Grand Avenue</span>
 </section>
 <section className="vigus-quick-specs container" aria-label="ძირითადი მონაცემები" data-vigus-reveal="metrics">
  <div><strong>2.5 <small>ლ</small></strong><span>დიზელის ძრავა</span></div>
  <div><strong>{spec('სიმძლავრე')}</strong><span>სიმძლავრე</span></div>
  <div><strong>4×4</strong><span>ამძრავი</span></div>
  <div><strong>{spec('კლირენსი')}</strong><span>კლირენსი</span></div>
 </section>
 <section id="story" className="vigus-story vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="01 / ხასიათი" title={<>შექმნილი რეალური გზებისთვის.</>} description={vehicle.description}/>
  <div className="vigus-story-mosaic" data-vigus-reveal="visual"><figure className="vigus-story-large"><img src={media.capability} alt="Grand Avenue - გზის შესაძლებლობები" loading="lazy"/></figure><figure className="vigus-story-small"><img src={media.rear} alt="Grand Avenue - უკანა რაკურსი" loading="lazy"/></figure><div className="vigus-story-note"><span>JMC Grand Avenue</span><p>ძალა და კომფორტი ყოველდღიურობაში.</p></div></div>
 </div></section>
 <section className="vigus-cinema" data-vigus-reveal="visual" aria-label="Grand Avenue ექსტერიერი">
  <img src={media.exterior} alt="Grand Avenue - ექსტერიერის ფართო ფოტო" loading="lazy"/>
  <div className="vigus-cinema-overlay"><span>02 / ექსტერიერი</span><h2>ფორმა, რომელსაც<br/>დანიშნულება აქვს.</h2></div>
 </section>
 <section id="design" className="vigus-highlights vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="დიზაინი და კომფორტი" title="დეტალები, რომლებიც მნიშვნელოვანია."/>
  <BrochureStory model={vehicle.name} scenes={highlights} media={media}/>
 </div></section>
 <section className="vigus-gallery-section vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="გალერეა" title="დეტალები ახლოდან."/>
  <GrandGallery photos={gallery.map(item=>({src:media[item.key]!,label:item.label}))}/>
 </div></section>
 <section id="technology" className="vigus-capabilities vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="შესაძლებლობები" title="ტექნიკური მონაცემები."/>
  <div className="vigus-capabilities-grid" data-vigus-reveal="metrics">
   <div><strong>{trim.transmission}</strong><span>ავტომატური ტრანსმისია</span></div>
   <div><strong>{spec('საწვავის ავზი')}</strong><span>საწვავის ავზი</span></div>
   <div><strong>{spec('თვლების ბაზა')}</strong><span>თვლების ბაზა</span></div>
  </div>
  <div className="grand-specification-groups">{groups.map(group=><section className="grand-specification-group" key={group.name} aria-label={group.name}><h3>{group.name}</h3><dl className="grand-specification-grid">{group.items.map(f=><div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}</dl></section>)}</div>
 </div></section>
 <section id="trims" className="vigus-trims vigus-section"><div className="container">
  <ModelSectionHeading animated eyebrow="კომპლექტაცია" title="Grand Avenue-ის კომპლექტაცია." description="მახასიათებლები და აღჭურვილობა 2026 წლის ბროშურის მიხედვით."/>
  <div className="vigus-selector" data-vigus-reveal="panel"><div className="vigus-selector-layout">
   <div className="vigus-selector-car"><img src={media.front} alt="Grand Avenue - 4X4 AT GL" loading="lazy"/></div>
   <div className="vigus-selector-details"><p className="vigus-eyebrow">კომპლექტაცია</p><h3>{trim.name}</h3><p>{trim.powertrain}</p><div className="vigus-selector-stats">
    <div><span>ტრანსმისია</span><strong>{trim.transmission}</strong></div><div><span>ამძრავი</span><strong>{trim.drivetrain}</strong></div><div><span>კლირენსი</span><strong>{spec('კლირენსი')}</strong></div>
   </div><Link href="/test-drive" className="vigus-pill vigus-pill-dark">ტესტ-დრაივის ინფორმაცია ↗</Link></div>
  </div></div>
  <div className="grand-equipment"><div className="grand-equipment-heading"><h3>აღჭურვილობა</h3><p>აირჩიე კატეგორია დეტალური ინფორმაციისთვის.</p></div>{categories.map(({key,name},index)=><details key={key} open={index===0}><summary>{name}<span>{equipment[key].length} ფუნქცია <i aria-hidden="true" className="grand-equipment-toggle-icon"/></span></summary><ul>{equipment[key].map(v=><li key={v}>{v}</li>)}</ul></details>)}</div>
 </div></section>
 <ModelClosingCTA name="Grand Avenue" title="გამოსცადე Grand Avenue." description="დაათვალიერე აღჭურვილობა და გაეცანი ტესტ-დრაივის პირობებს." compareHref="#trims" animated/>
 </main><Footer/></>;
}
