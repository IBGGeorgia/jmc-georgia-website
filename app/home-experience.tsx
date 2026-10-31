'use client';
import {useState} from 'react';
import Link from 'next/link';
type Item={slug:string;name:string;image:string;description:string};
export default function HomeExperience({items}:{items:Item[]}) {
 const [active,setActive]=useState(0);
 const selected=items[active]??items[0];
 return <section className="home3">
   <section className="home3-hero" aria-labelledby="home3-title">
     <div className="home3-hero-backdrop" aria-hidden="true" />
     <div className="home3-shell home3-hero-copy">
       <h1 id="home3-title">შენი გზა.<br/><span>ახალი <span className="home3-headline-word">შესაძლებლობები.</span></span></h1>
       <p>სამი პიკაპი სხვადასხვა საჭიროებისთვის. აღმოაჩინე შენთვის შესაფერისი JMC.</p>
       <div className="home3-actions"><a className="home3-pill home3-pill-red" href="#models">ნახე მოდელები <span aria-hidden="true">↗</span></a><Link className="home3-pill home3-pill-outline" href="/test-drive">დაჯავშნე Test Drive <span aria-hidden="true">↗</span></Link></div>
     </div>
   </section>
   <section className="home3-lineup home3-shell" id="models" aria-labelledby="home3-model-title">
      <div className="home3-heading"><div><p className="home3-kicker">01 / მოდელები</p><h2 id="home3-model-title">JMC-ის მოდელები</h2></div><p>აირჩიე მოდელი და გაეცანი მის შესაძლებლობებს.</p></div>
      <div className="home3-model-tabs" role="group" aria-label="აირჩიე JMC-ის მოდელი">
        {items.map((item,i)=><button key={item.slug} className={'home3-tab'+(active===i?' is-active':'')} onClick={()=>setActive(i)} aria-pressed={active===i}>{item.name}</button>)}
      </div>
      <div className="home3-vehicle-stage" aria-live="polite">
        <div className="home3-stage-image" key={selected.slug}><img src={selected.image} alt={`JMC ${selected.name} - სტუდიური სამი მეოთხედი რაკურსი`} width={1600} height={1200} loading="lazy" decoding="async"/></div>
        <div className="home3-stage-copy"><span className="home3-stage-index">{String(active+1).padStart(2,'0')} / 03 · JMC</span><h3>{selected.name}</h3><p>{selected.description.replaceAll('—','-')}</p><div className="home3-stage-buttons"><Link className="home3-pill home3-pill-dark" href={`/vehicles/${selected.slug}`}>მოდელის დეტალები <span aria-hidden="true">↗</span></Link><Link className="home3-pill home3-pill-light" href="/test-drive">დაჯავშნე Test Drive</Link></div></div>
      </div>
   </section>
 </section>;
}
