import type {ReactNode} from 'react';
import Link from 'next/link';

export type ModelNavigationItem={id:string;label:string};

/** Shared model-level navigation. Product-specific motion may enhance the optional progress bar. */
export function ModelLocalNavigation({
 name,items,progress=false
}:{name:string;items:readonly ModelNavigationItem[];progress?:boolean}){
 return <nav className="vigus-local-nav model-local-nav" aria-label={`${name}-ის გვერდის ნავიგაცია`}>
  <div className="container vigus-local-inner">
   <a href="#top" className="vigus-local-title">{name}</a>
   <div>{items.map(item=><a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</div>
   <Link href="/test-drive" className="vigus-local-cta" title="ტესტ-დრაივის ინფორმაცია — ონლაინ დაჯავშნა ამ ეტაპზე მიუწვდომელია">დაჯავშნე Test Drive <span aria-hidden="true">↗</span></Link>
  </div>
  {progress&&<span className="vigus-scroll-progress" aria-hidden="true">
   <span className="vigus-scroll-progress-fill"/>
  </span>}
 </nav>;
}

/** One consistent, semantically structured heading across all vehicle chapters. */
export function ModelSectionHeading({
 eyebrow,title,description,animated=false
}:{eyebrow:string;title:ReactNode;description?:string;animated?:boolean}){
 return <div className="vigus-section-heading model-section-heading"
  data-vigus-reveal={animated?'heading':undefined}>
  <span className="vigus-eyebrow">{eyebrow}</span>
  <h2>{title}</h2>
  {description&&<p>{description}</p>}
 </div>;
}

/** Truthful closing conversion step. No live test-drive request is implied. */
export function ModelClosingCTA({
 name,title,description,compareHref='#trims',animated=false
}:{name:string;title?:string;description?:string;compareHref?:string|null;animated?:boolean}){
 return <section className="vigus-final model-final" data-vigus-reveal={animated?'panel':undefined}>
  <div className="container">
   <span className="vigus-eyebrow">JMC Georgia</span>
   <h2>{title??`გაიცანი ${name} ახლოდან.`}</h2>
   <p>{description??`გაეცანი ${name}-ის მახასიათებლებსა და ტესტ-დრაივის ინფორმაციას.`}</p>
   <div>
    <Link href="/test-drive" className="vigus-pill vigus-pill-white">ტესტ-დრაივის ინფორმაცია <span aria-hidden="true">↗</span></Link>
    {compareHref&&<a href={compareHref} className="vigus-pill vigus-pill-outline">
     {compareHref==='#trims'?'შეადარე კომპლექტაციები':'მახასიათებლების ნახვა'}
    </a>}
   </div>
  </div>
 </section>;
}
