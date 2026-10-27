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
/* Four genuine exterior photos form a stepped orbit, not a synthetic 360-degree render.
   Missing rear-three-quarter and opposite-side frames are never fabricated. */
const orbit=[
 {file:'hero',name:'წინა ¾',angle:'¾',alt:'JMC Vigus — წინა სამი მეოთხედის ხედი'},
 {file:'front',name:'წინა',angle:'წინა',alt:'JMC Vigus — პირდაპირი წინა ხედი'},
 {file:'side',name:'პროფილი',angle:'გვერდი',alt:'JMC Vigus — გვერდითი პროფილი'},
 {file:'rear',name:'უკანა',angle:'უკანა',alt:'JMC Vigus — უკანა ხედი'}
];
export function VigusHighlights(){
 const [index,setIndex]=useState(0);
 const [expanded,setExpanded]=useState(false);
 const gesture=useRef<{x:number;last:number;active:boolean}>({x:0,last:0,active:false});
 const fullscreenClose=useRef<HTMLButtonElement>(null);
 const fullscreenTrigger=useRef<HTMLButtonElement>(null);
 const current=orbit[index];
 const step=(delta:number)=>setIndex(i=>Math.max(0,Math.min(orbit.length-1,i+delta)));
 useEffect(()=>{orbit.forEach(item=>{const img=new Image();img.src=`/images/vigus/${item.file}.webp`})},[]);
 useEffect(()=>{if(!expanded)return;fullscreenClose.current?.focus();const fn=(event:KeyboardEvent)=>{if(event.key==='Escape')setExpanded(false);if(event.key==='ArrowLeft')step(-1);if(event.key==='ArrowRight')step(1);if(event.key==='Tab'){const buttons=[fullscreenClose.current,...Array.from(document.querySelectorAll<HTMLButtonElement>('.vigus-orbit-full-controls button'))].filter(Boolean) as HTMLButtonElement[];const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}};document.addEventListener('keydown',fn);const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',fn);document.body.style.overflow=overflow;fullscreenTrigger.current?.focus()}},[expanded]);
 const orbitStage=<div className="vigus-orbit-stage" role="group" aria-label="Vigus-ის რაკურსების ინტერაქციული დათვალიერება"
 onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;gesture.current={x:e.clientX,last:e.clientX,active:true};e.currentTarget.setPointerCapture(e.pointerId)}}
 onPointerMove={e=>{if(!gesture.current.active)return;const dx=e.clientX-gesture.current.last;if(Math.abs(dx)>85){step(dx<0?1:-1);gesture.current.last=e.clientX}}}
 onPointerUp={e=>{gesture.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}
 onPointerCancel={()=>{gesture.current.active=false}}>
 <img key={current.file} className="vigus-orbit-frame" src={`/images/vigus/${current.file}.webp`} alt={current.alt} draggable={false}/>
 <div className="vigus-orbit-instruction">↔ გადააადგილე მაუსით ან თითით</div>
 </div>;
 return <div className="vigus-orbit">
 <div className="vigus-orbit-layout"><div className="vigus-orbit-main">{orbitStage}</div>
 <div className="vigus-orbit-info"><p className="vigus-eyebrow">INTERACTIVE VIEW / VIGUS</p><h3>ყველა დეტალი სხვა რაკურსით.</h3><p>დაათვალიერე ავტომობილი არსებული რეალური ფოტოებით. გადაათრიე მარცხნივ ან მარჯვნივ, ან გამოიყენე ისრები.</p>
 <div className="vigus-orbit-controls"><button type="button" aria-label="წინა რაკურსი" disabled={index===0} onClick={()=>step(-1)}>←</button><span aria-live="polite">{String(index+1).padStart(2,'0')} / {String(orbit.length).padStart(2,'0')} · {current.name}</span><button type="button" aria-label="შემდეგი რაკურსი" disabled={index===orbit.length-1} onClick={()=>step(1)}>→</button></div>
 <div className="vigus-orbit-steps" role="group" aria-label="რაკურსების არჩევა">{orbit.map((v,i)=><button key={v.file} type="button" className={index===i?'selected':''} aria-pressed={index===i} onClick={()=>setIndex(i)}>{v.name}</button>)}</div>
 <button ref={fullscreenTrigger} className="vigus-orbit-expand" type="button" onClick={()=>setExpanded(true)}>სრული ეკრანი ↗</button>
 <p className="vigus-orbit-disclosure">ეს არის 4 რეალური ფოტოს ინტერაქციული დათვალიერება და არა უწყვეტი 360° გადაღება.</p></div></div>
 {expanded&&<div className="vigus-orbit-fullscreen" role="dialog" aria-modal="true" aria-label="Vigus-ის რაკურსები სრულ ეკრანზე"><button ref={fullscreenClose} type="button" className="vigus-orbit-exit" onClick={()=>setExpanded(false)} aria-label="დახურვა">×</button>{orbitStage}<div className="vigus-orbit-full-controls"><button type="button" disabled={index===0} onClick={()=>step(-1)} aria-label="წინა ფოტო">←</button><span>{current.name}</span><button type="button" disabled={index===orbit.length-1} onClick={()=>step(1)} aria-label="შემდეგი ფოტო">→</button></div></div>}
 </div>;
}
export function VigusTrimSelector({trims}:{trims:Trim[]}){
 const [id,setId]=useState(trims[0]?.id??'');
 const t=trims.find(x=>x.id===id);
 if(!t)return null;
 return <div className="vigus-selector"><div className="vigus-selector-controls" role="group" aria-label="კომპლექტაციის არჩევა">{trims.map(x=><button key={x.id} type="button" aria-pressed={id===x.id} className={id===x.id?'selected':''} onClick={()=>setId(x.id)}>{x.name}</button>)}</div><div className="vigus-selector-layout"><div className="vigus-selector-car"><img src="/images/vigus/hero.webp" alt="JMC Vigus — პროდუქტის ფოტო" loading="lazy"/><small>საილუსტრაციო ფოტო — კომპლექტაციას შესაბამისი ცალკე გამოსახულება არ არის მოწოდებული</small></div><div className="vigus-selector-details"><p className="vigus-eyebrow">SELECTED VERSION</p><h3>{t.name}</h3><p>{t.powertrain}</p><div className="vigus-selector-stats"><div><span>ტრანსმისია</span><strong>{t.transmission}</strong></div><div><span>ამძრავი</span><strong>{t.drivetrain}</strong></div><div><span>სიმძლავრე</span><strong>167 HP</strong></div></div><Link href="/contact" className="vigus-pill vigus-pill-dark">ინფორმაციის მოთხოვნა ↗</Link></div></div></div>;
}
