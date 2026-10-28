import {Header,Footer} from '../../site-components';
import type {Vehicle} from '../../../lib/vehicles';
import {TrimComparison} from './trim-comparison';
import {ModelLocalNavigation,ModelSectionHeading,ModelClosingCTA} from './model-sections';

/** Data-driven fallback for future APPROVED models; no Vigus-specific imagery or claims. */
export function GenericModelPage({vehicle}:{vehicle:Vehicle}){
 const firstTrim=vehicle.trims[0];
 const specs=firstTrim?.features.slice(0,4)??[];
 const hasImages=vehicle.gallery.length>0;
 const hasTrims=vehicle.trims.length>0;
 const nav=[
  {id:'specifications',label:'მახასიათებლები'},
  ...(hasImages?[{id:'gallery',label:'ფოტოები'}]:[]),
  ...(hasTrims?[{id:'trims',label:'კომპლექტაციები'}]:[])
 ];
 return <>
  <Header/>
  <main className="model-page" id="top">
   <ModelLocalNavigation name={vehicle.name} items={nav}/>
   <section className="model-hero container" aria-labelledby="model-title">
    <div className="model-hero-copy">
     <span className="vigus-eyebrow">JMC Georgia · {vehicle.category==='pickup'?'პიკაპი':'ავტომობილი'}</span>
     <h1 id="model-title">{vehicle.name}</h1>
     <p>{vehicle.description}</p>
     <a href="#specifications" className="button">მახასიათებლების ნახვა <span aria-hidden="true">↓</span></a>
    </div>
    {vehicle.heroImage&&<div className="model-hero-image"><img src={vehicle.heroImage}
      alt={`JMC ${vehicle.name} — ავტომობილის ფოტო`} loading="eager" fetchPriority="high"/></div>}
   </section>
   <section className="model-section container" id="specifications">
    <ModelSectionHeading eyebrow="ტექნიკური მონაცემები" title="ძირითადი მახასიათებლები"
     description="ქვემოთ მოცემულია ამ მოდელისთვის დადასტურებული მონაცემები."/>
    {specs.length>0?
     <dl className="model-spec-grid">{specs.map(s=><div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>)}</dl>:
     <p className="model-information-pending">ტექნიკური მონაცემები დაემატება დადასტურების შემდეგ.</p>}
   </section>
   {hasImages&&<section className="model-section model-gallery-section" id="gallery">
    <div className="container">
     <ModelSectionHeading eyebrow="გალერეა" title="ავტომობილი ფოტოებში"/>
     <div className="model-photo-grid">{vehicle.gallery.map((src,i)=>
      <figure key={src}><img src={src} alt={`JMC ${vehicle.name} — ფოტო ${i+1}`} loading="lazy"/></figure>
     )}</div>
    </div>
   </section>}
   {hasTrims&&<section className="model-section container" id="trims">
    <ModelSectionHeading eyebrow="კომპლექტაციები" title="მახასიათებლების შედარება"
     description="შეადარე ხელმისაწვდომი კომპლექტაციების დადასტურებული მონაცემები."/>
    <TrimComparison trims={vehicle.trims}/>
   </section>}
   <ModelClosingCTA name={vehicle.name} compareHref={hasTrims?'#trims':'#specifications'}/>
  </main>
  <Footer/>
 </>;
}
