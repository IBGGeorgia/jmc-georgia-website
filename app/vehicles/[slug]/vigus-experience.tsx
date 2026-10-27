'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import type {Trim} from '../../../lib/vehicles';
const views=[
 {id:'hero',name:'¾ ხედი',file:'hero',alt:'JMC Vigus — წინა სამი მეოთხედის ხედი'},
 {id:'front',name:'წინა',file:'front',alt:'JMC Vigus — წინა ხედი'},
 {id:'side',name:'გვერდი',file:'side',alt:'JMC Vigus — გვერდითი ხედი'},
 {id:'rear',name:'უკანა',file:'rear',alt:'JMC Vigus — უკანა ხედი'}
] as const;
export function VigusViewer(){
 const [selected,setSelected]=useState(0);
 const [fullscreen,setFullscreen]=useState(false);
 useEffect(()=>{if(!fullscreen)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setFullscreen(false)};document.addEventListener('keydown',close);const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',close);document.body.style.overflow=prev}},[fullscreen]);
 const v=views[selected];
 return <div className="vigus-viewer">
  <div className="vigus-viewer-stage" key={v.id}><img src={`/images/vigus/${v.file}.webp`} alt={v.alt}/><button type="button" className="vigus-viewer-expand" onClick={()=>setFullscreen(true)} aria-label="ფოტოს სრულ ეკრანზე ნახვა">⛶ <span>სრული ეკრანი</span></button></div>
  <div className="vigus-viewer-options" role="group" aria-label="ავტომობილის რაკურსი">{views.map((item,i)=><button type="button" key={item.id} className={i===selected?'is-active':''} aria-pressed={i===selected} onClick={()=>setSelected(i)}><img src={`/images/vigus/${item.file}.webp`} alt=""/><span>{item.name}</span></button>)}</div>
  <p className="vigus-viewer-disclaimer">ავტომობილის ფოტოები საილუსტრაციოა. კომპლექტაციის ვიზუალური დეტალები შესაძლოა განსხვავდებოდეს.</p>
  {fullscreen&&<div className="vigus-lightbox" role="dialog" aria-modal="true" aria-label={v.alt}><button type="button" className="vigus-lightbox-close" onClick={()=>setFullscreen(false)} aria-label="დახურვა">×</button><img src={`/images/vigus/${v.file}.webp`} alt={v.alt}/><div><button type="button" onClick={()=>setSelected(x=>(x+views.length-1)%views.length)} aria-label="წინა რაკურსი">←</button><span>{v.name}</span><button type="button" onClick={()=>setSelected(x=>(x+1)%views.length)} aria-label="შემდეგი რაკურსი">→</button></div></div>}
 </div>;
}
const highlights=[
 {name:'გამოკვეთილი დიზაინი',description:'JMC-ის დამახასიათებელი წინა ნაწილი და პრაქტიკული პიკაპის პროპორციები.',file:'front',label:'EXTERIOR'},
 {name:'მართვის სივრცე',description:'მძღოლის სამუშაო სივრცის ფუნქციური განლაგება.',file:'cockpit',label:'INTERIOR'},
 {name:'დეტალებზე ყურადღება',description:'სავარძლების ფორმა, გამოყენებული მასალები და სალონის პრაქტიკული გადაწყვეტილებები.',file:'seats',label:'COMFORT'},
 {name:'კონტროლი ერთი შეხედვით',description:'მაჩვენებლების პანელი და მართვისთვის საჭირო ინფორმაცია.',file:'dashboard',label:'DETAILS'}
];
export function VigusHighlights(){
 const [current,setCurrent]=useState(0);
 const h=highlights[current];
 return <div className="vigus-highlight-experience"><div className="vigus-highlight-stage" key={h.file}><img src={`/images/vigus/${h.file}.webp`} alt={h.name} loading="lazy"/></div><div className="vigus-highlight-info"><div className="vigus-highlight-options" role="tablist" aria-label="ავტომობილის გამორჩეული დეტალები">{highlights.map((item,i)=><button type="button" role="tab" aria-selected={i===current} className={i===current?'selected':''} key={item.file} onClick={()=>setCurrent(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.name}</button>)}</div><div className="vigus-highlight-caption" role="tabpanel"><span className="vigus-eyebrow">{h.label}</span><h3>{h.name}</h3><p>{h.description}</p></div></div></div>;
}
export function VigusTrimSelector({trims}:{trims:Trim[]}){
 const [id,setId]=useState(trims[0]?.id??'');
 const t=trims.find(x=>x.id===id);
 if(!t)return null;
 return <div className="vigus-selector"><div className="vigus-selector-controls" role="group" aria-label="კომპლექტაციის არჩევა">{trims.map(x=><button key={x.id} type="button" aria-pressed={id===x.id} className={id===x.id?'selected':''} onClick={()=>setId(x.id)}>{x.name}</button>)}</div><div className="vigus-selector-layout"><div className="vigus-selector-car"><img src="/images/vigus/hero.webp" alt="JMC Vigus — პროდუქტის ფოტო" loading="lazy"/><small>საილუსტრაციო ფოტო — კომპლექტაციას შესაბამისი ცალკე გამოსახულება არ არის მოწოდებული</small></div><div className="vigus-selector-details"><p className="vigus-eyebrow">SELECTED VERSION</p><h3>{t.name}</h3><p>{t.powertrain}</p><div className="vigus-selector-stats"><div><span>ტრანსმისია</span><strong>{t.transmission}</strong></div><div><span>ამძრავი</span><strong>{t.drivetrain}</strong></div><div><span>სიმძლავრე</span><strong>167 HP</strong></div></div><Link href="/contact" className="vigus-pill vigus-pill-dark">ინფორმაციის მოთხოვნა ↗</Link></div></div></div>;
}
