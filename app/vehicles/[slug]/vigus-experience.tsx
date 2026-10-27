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
 {file:'hero',name:'წინა ¾',angle:'¾',alt:'JMC Vigus — წინა სამი მეოთხედის ხედი'},
 {file:'front',name:'წინა',angle:'წინა',alt:'JMC Vigus — პირდაპირი წინა ხედი'},
 {file:'side',name:'პროფილი',angle:'გვერდი',alt:'JMC Vigus — გვერდითი პროფილი'},
 {file:'rear',name:'უკანა',angle:'უკანა',alt:'JMC Vigus — უკანა ხედი'}
];
/* Remove only near-black background connected to image edges; never recolor car pixels. */
async function makeTransparentVigus(source:string):Promise<string>{
 const photo=new Image();photo.decoding='async';photo.src=source;await photo.decode();
 const scale=Math.min(1,1600/Math.max(photo.naturalWidth,photo.naturalHeight));
 const width=Math.max(1,Math.round(photo.naturalWidth*scale)),height=Math.max(1,Math.round(photo.naturalHeight*scale));
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)throw new Error('Canvas unavailable');
 ctx.drawImage(photo,0,0,width,height);
 const image=ctx.getImageData(0,0,width,height),pixels=image.data;
 const count=width*height,visited=new Uint8Array(count),stack=new Int32Array(count);let top=0,removed=0;
 const eligible=(p:number)=>{const i=p*4,r=pixels[i],g=pixels[i+1],b=pixels[i+2];return Math.max(r,g,b)<105 && Math.max(r,g,b)-Math.min(r,g,b)<46};
 const seed=(p:number)=>{if(!visited[p]&&eligible(p)){visited[p]=1;stack[top++]=p}};
 for(let x=0;x<width;x++){seed(x);seed((height-1)*width+x)}
 for(let y=0;y<height;y++){seed(y*width);seed(y*width+width-1)}
 while(top){
  const p=stack[--top];pixels[p*4+3]=0;removed++;const x=p%width;
  if(x>0)seed(p-1);if(x<width-1)seed(p+1);if(p>=width)seed(p-width);if(p<count-width)seed(p+width);
 }
 if(removed/count<.035)throw new Error('Background not detected safely');
 // Antialias pixels immediately inside the cut-out boundary without touching the body.
 const alpha=new Uint8Array(count);for(let p=0;p<count;p++)alpha[p]=pixels[p*4+3];
 for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){
  const p=y*width+x;if(!alpha[p])continue;
  const transparentNeighbors=(alpha[p-1]===0?1:0)+(alpha[p+1]===0?1:0)+(alpha[p-width]===0?1:0)+(alpha[p+width]===0?1:0);
  if(transparentNeighbors)pixels[p*4+3]=Math.max(130,255-transparentNeighbors*35);
 }
 ctx.putImageData(image,0,0);
 return canvas.toDataURL('image/png');
}

export function VigusViewer(){
 const [index,setIndex]=useState(0);
 const [cutouts,setCutouts]=useState<Record<string,string>>({});
 const [expanded,setExpanded]=useState(false);
 const gesture=useRef<{x:number;last:number;active:boolean}>({x:0,last:0,active:false});
 const fullscreenClose=useRef<HTMLButtonElement>(null);
 const fullscreenTrigger=useRef<HTMLButtonElement>(null);
 const current=orbit[index];
 const step=(delta:number)=>setIndex(i=>Math.max(0,Math.min(orbit.length-1,i+delta)));
 useEffect(()=>{
  let cancelled=false;
  Promise.allSettled(orbit.map(async item=>{
   const src=await makeTransparentVigus(`/images/vigus/${item.file}.webp`);
   if(!cancelled)setCutouts(prev=>({...prev,[item.file]:src}));
  })).then(()=>{});
  return()=>{cancelled=true};
 },[]);

 useEffect(()=>{if(!expanded)return;fullscreenClose.current?.focus();const fn=(event:KeyboardEvent)=>{if(event.key==='Escape')setExpanded(false);if(event.key==='ArrowLeft')step(-1);if(event.key==='ArrowRight')step(1);if(event.key==='Tab'){const buttons=[fullscreenClose.current,...Array.from(document.querySelectorAll<HTMLButtonElement>('.vigus-orbit-full-controls button'))].filter(Boolean) as HTMLButtonElement[];const first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}};document.addEventListener('keydown',fn);const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.removeEventListener('keydown',fn);document.body.style.overflow=overflow;fullscreenTrigger.current?.focus()}},[expanded]);
 const orbitStage=<div className="vigus-orbit-stage" role="group" aria-label="Vigus-ის რაკურსების ინტერაქციული დათვალიერება"
 onPointerDown={e=>{if(e.pointerType==='mouse'&&e.button!==0)return;gesture.current={x:e.clientX,last:e.clientX,active:true};e.currentTarget.setPointerCapture(e.pointerId)}}
 onPointerMove={e=>{if(!gesture.current.active)return;const dx=e.clientX-gesture.current.last;if(Math.abs(dx)>85){step(dx<0?1:-1);gesture.current.last=e.clientX}}}
 onPointerUp={e=>{gesture.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}}
 onPointerCancel={()=>{gesture.current.active=false}}>
 <div className="vigus-orbit-car-frames">{orbit.map((v,i)=><img key={v.file} className={`vigus-orbit-frame vigus-orbit-layer${index===i?' is-active':''}`} src={cutouts[v.file]??`/images/vigus/${v.file}.webp`} alt={index===i?v.alt:''} aria-hidden={index!==i} draggable={false}/>)}</div>
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
const highlights=[
 {name:'გამოკვეთილი დიზაინი',description:'JMC-ის დამახასიათებელი წინა ნაწილი და პრაქტიკული პიკაპის პროპორციები.',file:'front',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_203803_28e2b347-e810-4014-b9c3-674f6f5aa9e5.png',label:'EXTERIOR'},
 {name:'მართვის სივრცე',description:'მძღოლის სამუშაო სივრცის ფუნქციური განლაგება.',file:'cockpit',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_203808_6fac22a0-3b14-4969-89cf-eb33af05844c.png',label:'INTERIOR'},
 {name:'დეტალებზე ყურადღება',description:'სავარძლების ფორმა, გამოყენებული მასალები და სალონის პრაქტიკული გადაწყვეტილებები.',file:'seats',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_204633_66f89bc9-8dfa-4e68-b580-d8945f3f9f6a.png',label:'COMFORT'},
 {name:'კონტროლი ერთი შეხედვით',description:'მაჩვენებლების პანელი და მართვისთვის საჭირო ინფორმაცია.',file:'dashboard',src:'https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_204632_cf828e84-aba1-4738-95c8-787dcf4de144.png',label:'DETAILS'}
];
export function VigusHighlights(){
 const [current,setCurrent]=useState(0);
 const h=highlights[current];
 return <div className="vigus-highlight-experience"><div className="vigus-highlight-stage" key={h.file}><img src={h.src} alt={h.name} loading="lazy"/></div><div className="vigus-highlight-info"><div className="vigus-highlight-options" role="tablist" aria-label="ავტომობილის გამორჩეული დეტალები">{highlights.map((item,i)=><button type="button" role="tab" aria-selected={i===current} className={i===current?'selected':''} key={item.file} onClick={()=>setCurrent(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.name}</button>)}</div><div className="vigus-highlight-caption" role="tabpanel"><span className="vigus-eyebrow">{h.label}</span><h3>{h.name}</h3><p>{h.description}</p></div></div></div>;
}
export function VigusTrimSelector({trims}:{trims:Trim[]}){
 const [id,setId]=useState(trims[0]?.id??'');
 const t=trims.find(x=>x.id===id);
 if(!t)return null;
 return <div className="vigus-selector"><div className="vigus-selector-controls" role="group" aria-label="კომპლექტაციის არჩევა">{trims.map(x=><button key={x.id} type="button" aria-pressed={id===x.id} className={id===x.id?'selected':''} onClick={()=>setId(x.id)}>{x.name}</button>)}</div><div className="vigus-selector-layout"><div className="vigus-selector-car"><img src="/images/vigus/hero.webp" alt="JMC Vigus — პროდუქტის ფოტო" loading="lazy"/><small>საილუსტრაციო ფოტო — კომპლექტაციას შესაბამისი ცალკე გამოსახულება არ არის მოწოდებული</small></div><div className="vigus-selector-details"><p className="vigus-eyebrow">SELECTED VERSION</p><h3>{t.name}</h3><p>{t.powertrain}</p><div className="vigus-selector-stats"><div><span>ტრანსმისია</span><strong>{t.transmission}</strong></div><div><span>ამძრავი</span><strong>{t.drivetrain}</strong></div><div><span>სიმძლავრე</span><strong>167 HP</strong></div></div><Link href="/contact" className="vigus-pill vigus-pill-dark">ინფორმაციის მოთხოვნა ↗</Link></div></div></div>;
}
