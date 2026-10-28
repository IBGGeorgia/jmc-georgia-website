'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import type {Trim} from '../../../lib/vehicles';
const views=[
 {id:'hero',name:'¾ ხედი',file:'hero',alt:'JMC Vigus — წინა სამი მეოთხედის ხედი'},
 {id:'front',name:'წინა',file:'front',alt:'JMC Vigus — წინა ხედი'},
 {id:'side',name:'გვერდი',file:'side',alt:'JMC Vigus — გვერდითი ხედი'},
 {id:'rear',name:'უკანა',file:'rear',alt:'JMC Vigus — უკანა ხედი'}
] as const;
/* Four genuine exterior photos form a stepped orbit, not a synthetic 360-degree render.
   Missing rear-three-quarter and opposite-side frames are never fabricated. */
const orbit=[
 {file:'hero',name:'წინა ¾',angle:'¾',alt:'JMC Vigus — წინა სამი მეოთხედის ხედი',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_210239_e704b7f4-6959-42d2-98bc-560e6d257b29.png'},
 {file:'front',name:'წინა',angle:'წინა',alt:'JMC Vigus — პირდაპირი წინა ხედი',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_210239_157d21be-e243-4d02-be84-e6cf23168015.png'},
 {file:'side',name:'პროფილი',angle:'გვერდი',alt:'JMC Vigus — გვერდითი პროფილი',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_210239_62f09045-448b-43cb-8125-43439a26b439.png'},
 {file:'rear',name:'უკანა',angle:'უკანა',alt:'JMC Vigus — უკანა ხედი',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_210739_2e81464d-1294-4bee-bcd1-5cf90774e8d4.png'}
];
export function VigusViewer(){
 const [index,setIndex]=useState(0);
 const [expanded,setExpanded]=useState(false);
 const gesture=useRef<{x:number;last:number;active:boolean}>({x:0,last:0,active:false});
 const fullscreenClose=useRef<HTMLButtonElement>(null);
 const fullscreenTrigger=useRef<HTMLButtonElement>(null);
 const current=orbit[index];
 const step=(delta:number)=>setIndex(i=>Math.max(0,Math.min(orbit.length-1,i+delta)));


 useEffect(()=>{if(!expanded)return;fullscreenClose.current?.focus();const fn=(event:KeyboardEvent)=>{if(event.key==='Escape')setExpanded(false);if(event.key==='ArrowLeft')step(-1);if(event.key==='ArrowRight')step(1);if(event.key==='Tab'){const buttons=[fullscreenClose.current,...Array.from(document.querySelectorAll<HTMLButtonElement>('.vigus-orbit-full-controls button'))].filter(Boolean) as HTMLButtonElement[];const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}};document.addEventListener('keydown',fn);const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',fn);document.body.style.overflow=overflow;fullscreenTrigger.current?.focus()}},[expanded]);
 const orbitStage=<div className="vigus-orbit-stage" role="group" aria-label="Vigus-ის რაკურსების ინტერაქციული დათვალიერება"
 onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;gesture.current={x:e.clientX,last:e.clientX,active:true};e.currentTarget.setPointerCapture(e.pointerId)}}
 onPointerMove={e=>{if(!gesture.current.active)return;const dx=e.clientX-gesture.current.last;if(Math.abs(dx)>85){step(dx<0?1:-1);gesture.current.last=e.clientX}}}
 onPointerUp={e=>{gesture.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}
 onPointerCancel={()=>{gesture.current.active=false}}>
 <div className="vigus-orbit-car-frames">{orbit.map((v,i)=><img key={v.file} className={`vigus-orbit-frame vigus-orbit-layer${index===i?' is-active':''}`} src={v.src} alt={index===i?v.alt:''} aria-hidden={index!==i} draggable={false} loading={i===0?"eager":"lazy"} decoding="async"/>)}</div>
 <div className="vigus-orbit-instruction">↔ გადააადგილე მაუსით ან თითით</div>
 </div>;
 return <div className="vigus-orbit" data-vigus-reveal="visual">
 <div className="vigus-orbit-layout"><div className="vigus-orbit-main">{orbitStage}</div>
 <div className="vigus-orbit-info"><p className="vigus-eyebrow">Vigus-ის რაკურსები</p><h3>ყველა დეტალი სხვა რაკურსით.</h3><p>დაათვალიერე ავტომობილი არსებული რეალური ფოტოებით. გადაათრიე მარცხნივ ან მარჯვნივ, ან გამოიყენე ისრები.</p>
 <div className="vigus-orbit-controls"><button type="button" aria-label="წინა რაკურსი" disabled={index===0} onClick={()=>step(-1)}>←</button><span aria-live="polite">{String(index+1).padStart(2,'0')} / {String(orbit.length).padStart(2,'0')} · {current.name}</span><button type="button" aria-label="შემდეგი რაკურსი" disabled={index===orbit.length-1} onClick={()=>step(1)}>→</button></div>
 <div className="vigus-orbit-steps" role="group" aria-label="რაკურსების არჩევა">{orbit.map((v,i)=><button key={v.file} type="button" className={index===i?'selected':''} aria-pressed={index===i} onClick={()=>setIndex(i)}>{v.name}</button>)}</div>
 <button ref={fullscreenTrigger} className="vigus-orbit-expand" type="button" onClick={()=>setExpanded(true)}>სრული ეკრანი ↗</button>
 <p className="vigus-orbit-disclosure">ეს არის 4 რეალური ფოტოს ინტერაქციული დათვალიერება და არა უწყვეტი 360° გადაღება.</p></div></div>
 {expanded&&<div className="vigus-orbit-fullscreen" role="dialog" aria-modal="true" aria-label="Vigus-ის რაკურსები სრულ ეკრანზე"><button ref={fullscreenClose} type="button" className="vigus-orbit-exit" onClick={()=>setExpanded(false)} aria-label="დახურვა">×</button>{orbitStage}<div className="vigus-orbit-full-controls"><button type="button" disabled={index===0} onClick={()=>step(-1)} aria-label="წინა ფოტო">←</button><span>{current.name}</span><button type="button" disabled={index===orbit.length-1} onClick={()=>step(1)} aria-label="შემდეგი ფოტო">→</button></div></div>}
 </div>;
}
const highlights=[
 {name:'გამოკვეთილი დიზაინი',description:'JMC-ის დამახასიათებელი წინა ნაწილი და პრაქტიკული პიკაპის პროპორციები.',file:'front',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_203803_28e2b347-e810-4014-b9c3-674f6f5aa9e5.png',label:'ექსტერიერი'},
 {name:'მართვის სივრცე',description:'მძღოლის სამუშაო სივრცის ფუნქციური განლაგება.',file:'cockpit',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_203808_6fac22a0-3b14-4969-89cf-eb33af05844c.png',label:'ინტერიერი'},
 {name:'დეტალებზე ყურადღება',description:'სავარძლების ფორმა, გამოყენებული მასალები და სალონის პრაქტიკული გადაწყვეტილებები.',file:'seats',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_204633_66f89bc9-8dfa-4e68-b580-d8945f3f9f6a.png',label:'კომფორტი'},
 {name:'კონტროლი ერთი შეხედვით',description:'მაჩვენებლების პანელი და მართვისთვის საჭირო ინფორმაცია.',file:'dashboard',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_204632_cf828e84-aba1-4738-95c8-787dcf4de144.png',label:'დეტალები'}
];
export function VigusHighlights(){
 const [current,setCurrent]=useState(0);
 const shell=useRef<HTMLDivElement>(null);
 const h=highlights[current];
 useEffect(()=>{
  const root=shell.current;
  if(!root)return;
  const desktop=window.matchMedia('(min-width: 961px)');
  if(!desktop.matches)return;
  const buttons=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-vigus-story-step]'));
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting){
     const n=Number((entry.target as HTMLElement).dataset.vigusStoryStep);
     if(Number.isFinite(n))setCurrent(n);
    }
   }
  },{rootMargin:'-36% 0px -42% 0px',threshold:0.05});
  buttons.forEach(button=>observer.observe(button));
  return ()=>observer.disconnect();
 },[]);
 const choose=(i:number)=>{
  setCurrent(i);
  if(window.matchMedia('(min-width: 961px)').matches){
   const el=shell.current?.querySelector<HTMLElement>(`[data-vigus-story-step="${i}"]`);
   el?.scrollIntoView({
    behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',
    block:'center'
   });
  }
 };
 return <div ref={shell} className="vigus-highlight-experience vigus-storytelling" data-vigus-reveal="visual">
  <div className="vigus-highlight-stage" aria-live="off">
   {highlights.map((item,i)=>
    <img key={item.file} src={item.src} alt={current===i?item.name:''}
     className={i===current?'vigus-story-image is-active':'vigus-story-image'}
     aria-hidden={i!==current} loading={i===0?"eager":"lazy"} decoding="async"/>)}
   <div className="vigus-story-image-counter" aria-hidden="true">{String(current+1).padStart(2,'0')} / {String(highlights.length).padStart(2,'0')}</div>
  </div>
  <div className="vigus-highlight-info">
   <div className="vigus-highlight-options" role="tablist" aria-label="ავტომობილის გამორჩეული დეტალები">
    {highlights.map((item,i)=>
     <button key={item.file} type="button" role="tab"
      id={`vigus-highlight-tab-${i}`} data-vigus-story-step={i}
      aria-controls="vigus-highlight-panel" aria-selected={i===current}
      tabIndex={i===current?0:-1} className={i===current?'selected':''}
      onClick={()=>choose(i)}
      onKeyDown={event=>{
       const key=event.key;
       let next=i;
       if(key==='ArrowRight'||key==='ArrowDown')next=(i+1)%highlights.length;
       else if(key==='ArrowLeft'||key==='ArrowUp')next=(i-1+highlights.length)%highlights.length;
       else if(key==='Home')next=0;
       else if(key==='End')next=highlights.length-1;
       else return;
       event.preventDefault();
       choose(next);
       event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
      }}>
      <span className="vigus-story-step-index">{String(i+1).padStart(2,'0')}</span>
      <span className="vigus-story-step-copy"><strong>{item.name}</strong><small>{item.description}</small></span>
     </button>)}
   </div>
   <div className="vigus-highlight-caption" role="tabpanel" id="vigus-highlight-panel"
    aria-labelledby={`vigus-highlight-tab-${current}`} tabIndex={0}>
    <span className="vigus-eyebrow">{h.label}</span><h3>{h.name}</h3><p>{h.description}</p>
   </div>
  </div>
 </div>;
}
export function VigusTrimSelector({trims}:{trims:Trim[]}){
 const [id,setId]=useState(trims[0]?.id??'');
 const t=trims.find(x=>x.id===id);
 if(!t)return null;
 return <div className="vigus-selector" data-vigus-reveal="panel"><div className="vigus-selector-controls" role="group" aria-label="კომპლექტაციის არჩევა">{trims.map(x=><button key={x.id} type="button" aria-pressed={id===x.id} className={id===x.id?'selected':''} onClick={()=>setId(x.id)}>{x.name}</button>)}</div><div className="vigus-selector-layout"><div className="vigus-selector-car"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_211343_87663d42-c2c8-4c4b-8ca0-b58d5dd34884.png" alt="JMC Vigus — პროდუქტის ფოტო" loading="lazy"/><small>საილუსტრაციო ფოტო — კომპლექტაციას შესაბამისი ცალკე გამოსახულება არ არის მოწოდებული</small></div><div className="vigus-selector-details"><p className="vigus-eyebrow">არჩეული კომპლექტაცია</p><div className="vigus-trim-animated" key={t.id}><h3>{t.name}</h3><p>{t.powertrain}</p><div className="vigus-selector-stats"><div><span>ტრანსმისია</span><strong>{t.transmission}</strong></div><div><span>ამძრავი</span><strong>{t.drivetrain}</strong></div><div><span>სიმძლავრე</span><strong>{t.features.find(f=>f.label==='სიმძლავრე')?.value??'დაზუსტდება'}</strong></div></div></div><Link href="/test-drive" className="vigus-pill vigus-pill-dark">ტესტ-დრაივის ინფორმაცია ↗</Link></div></div></div>;
}
