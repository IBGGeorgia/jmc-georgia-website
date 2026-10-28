import {Header,Footer} from '../../site-components';
import type {Vehicle,Feature} from '../../../lib/vehicles';
import {ModelLocalNavigation,ModelSectionHeading,ModelClosingCTA} from './model-sections';
import {BrochureStory,type EditorialScene,type EditorialMedia} from './brochure-story';
import {BrochureModelMotion} from './brochure-model-motion';

export type BrochureModelContent={
 vehicle:Vehicle;
 intro:string;
 highlights:readonly EditorialScene[];
 technical:readonly Feature[];
 equipment:{
  exterior:readonly string[];
  interior:readonly string[];
  safety:readonly string[];
  capability:readonly string[];
 };
 media:EditorialMedia;
};
const equipmentCategories=[
 {key:'exterior',name:'ექსტერიერი',index:'01'},
 {key:'interior',name:'ინტერიერი',index:'02'},
 {key:'safety',name:'უსაფრთხოება',index:'03'},
 {key:'capability',name:'შესაძლებლობები',index:'04'}
] as const;

function getFact(list:readonly Feature[],label:string){
 return list.find(item=>item.label===label)?.value;
}

/**
 * Premium vehicle layout, independent of Vigus imagery or specifications.
 * Invisible from public routes until vehicle.publicationStatus === 'approved'.
 */
export function BrochureModelPage({
 vehicle,intro,highlights,technical,equipment,media
}:BrochureModelContent){
 const facts=[
  {label:'ძრავი',value:getFact(technical,'ძრავი')},
  {label:'სიმძლავრე',value:getFact(technical,'სიმძლავრე')},
  {label:'კლირენსი',value:getFact(technical,'კლირენსი')},
  {label:'საწვავის ავზი',value:getFact(technical,'საწვავის ავზი')}
 ].filter((f):f is {label:string;value:string}=>Boolean(f.value));
 const gallery=[
  {key:'front',name:'წინა რაკურსი'},
  {key:'side',name:'გვერდითი რაკურსი'},
  {key:'rear',name:'უკანა რაკურსი'},
  {key:'detail',name:'დეტალი'}
 ] as const;
 const available=gallery.filter(item=>Boolean(media[item.key]));
 const navigation=[
  {id:'story',label:'აღმოაჩინე'},
  {id:'specifications',label:'მახასიათებლები'},
  {id:'equipment',label:'აღჭურვილობა'},
  ...(available.length?[{id:'gallery',label:'გალერეა'}]:[])
 ];
 return <>
  <Header/>
  <main className="model-page brochure-model" id="top">
   <BrochureModelMotion/>
   <ModelLocalNavigation name={vehicle.name} items={navigation} progress/>
   <section className="brochure-hero" aria-labelledby="brochure-model-title">
    <div className="container brochure-hero-copy">
     <p className="brochure-kicker">JMC Georgia / პიკაპი · 2026</p>
     <h1 id="brochure-model-title">{vehicle.name}</h1>
     <p className="brochure-lead">{intro}</p>
     <p className="brochure-hero-description">{vehicle.description}</p>
     <div className="brochure-actions">
      <a className="button" href="#specifications">მახასიათებლები <span aria-hidden="true">↓</span></a>
      <a className="brochure-inline-link" href="#story">დეტალების დათვალიერება <span aria-hidden="true">↗</span></a>
     </div>
    </div>
    <div className="container brochure-hero-visual">
     {media.hero?
      <img src={media.hero} alt={`JMC ${vehicle.name} — მთავარი ფოტო`}
       decoding="async" loading="eager" fetchPriority="high"/>:
      <div className="brochure-no-photo" aria-hidden="true">
       <span>JMC / 2026</span><strong>{vehicle.name}</strong>
      </div>
     }
    </div>
   </section>
   <dl className="container brochure-facts" aria-label="ძირითადი მონაცემები" data-model-reveal>
    {facts.map(fact=><div key={fact.label}>
     <dt>{fact.label}</dt><dd>{fact.value}</dd>
    </div>)}
   </dl>
   <section id="story" className="container brochure-chapter">
    <ModelSectionHeading eyebrow="აღმოაჩინე" title={<>შესაძლებლობები.<span> ყოველდღე.</span></>}
     description="ბროშურაში დადასტურებული დიზაინი, ფუნქციურობა, კომფორტი და უსაფრთხოება ერთ სივრცეში."/>
    <BrochureStory model={vehicle.name} scenes={highlights} media={media}/>
   </section>
   <section id="specifications" className="brochure-technical">
    <div className="container">
     <ModelSectionHeading eyebrow="ტექნიკური მონაცემები" title="ყოველი დეტალი მნიშვნელოვანია."
      description={`${vehicle.name} — ${vehicle.trims[0]?.name??"დადასტურებული ვერსია"}: 2026 წლის ბროშურის მონაცემები.`}/>
     <dl className="brochure-tech-grid" data-model-reveal>
      {technical.map(item=><div key={item.label}>
       <dt>{item.label}</dt><dd>{item.value}</dd>
      </div>)}
     </dl>
    </div>
   </section>
   <section id="equipment" className="container brochure-equipment">
    <ModelSectionHeading eyebrow="კომპლექტაცია" title="აღჭურვილობა."
     description={`${vehicle.name} ${vehicle.trims[0]?.name??""} — კომფორტისა და უსაფრთხოების აღჭურვილობის სრული სია.`}/>
    <div className="brochure-equipment-list" data-model-reveal>
     {equipmentCategories.map(({key,name,index},i)=>
      <details key={key} open={i===0}>
       <summary><span className="brochure-equipment-index">{index}</span>
        <strong>{name}</strong><span className="brochure-equipment-count">{equipment[key].length} ფუნქცია</span>
        <span className="brochure-plus" aria-hidden="true">+</span></summary>
       <ul>{equipment[key].map(item=><li key={item}>{item}</li>)}</ul>
      </details>)}
    </div>
   </section>
   {available.length>0&&<section id="gallery" className="brochure-gallery">
    <div className="container">
     <ModelSectionHeading eyebrow="ფოტოგალერეა" title={`${vehicle.name} სხვადასხვა რაკურსით.`}/>
     <div className="brochure-gallery-grid">
      {available.map((item,i)=><figure key={item.key} data-model-reveal>
       <img src={media[item.key]!} loading="lazy" decoding="async"
        alt={`JMC ${vehicle.name} — ${item.name}`}/>
       <figcaption><span>{String(i+1).padStart(2,'0')}</span>{item.name}</figcaption>
      </figure>)}
     </div>
    </div>
   </section>}
   <ModelClosingCTA name={vehicle.name}
    title={`გაიცანი ${vehicle.name} ახლოდან.`}
    description="შეისწავლე მისი აღჭურვილობა და გაეცანი ტესტ-დრაივის ინფორმაციას."
    compareHref="#equipment"/>
  </main>
  <Footer/>
 </>;
}
