'use client';
import {useEffect,useRef,useState} from 'react';
type Photo={src:string;label:string};
export function GrandGallery({photos}:{photos:Photo[]}){
 const [active,setActive]=useState<number|null>(null);
 const closeRef=useRef<HTMLButtonElement>(null);
 const triggerRefs=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{
  if(active===null)return;
  const old=document.body.style.overflow;document.body.style.overflow='hidden';
  closeRef.current?.focus();
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();setActive(null)}
   if(e.key==='ArrowLeft'){e.preventDefault();setActive(i=>i===null?null:(i+photos.length-1)%photos.length)}
   if(e.key==='ArrowRight'){e.preventDefault();setActive(i=>i===null?null:(i+1)%photos.length)}
   if(e.key==='Tab'){const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('.grand-lightbox button'));if(!buttons.length)return;const first=buttons[0],last=buttons[buttons.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  };
  document.addEventListener('keydown',onKey);
  return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',onKey);triggerRefs.current[active]?.focus()};
 },[active,photos.length]);
 return <>
  <div className="grand-gallery-grid" data-vigus-reveal="visual">{photos.map((item,i)=><figure key={item.src}>
   <button ref={el=>{triggerRefs.current[i]=el}} type="button" className="grand-gallery-open" onClick={()=>setActive(i)} aria-label={`${item.label} — სრულ ეკრანზე ნახვა`}>
    <img src={item.src} alt={`JMC Grand Avenue — ${item.label}`} loading="lazy"/>
    <span className="grand-gallery-zoom" aria-hidden="true">↗</span>
   </button><figcaption>{String(i+1).padStart(2,'0')} / {item.label}</figcaption>
  </figure>)}</div>
  {active!==null&&<div className="grand-lightbox" role="dialog" aria-modal="true" aria-label="Grand Avenue — ფოტოგალერეა">
   <button ref={closeRef} type="button" className="grand-lightbox-close" onClick={()=>setActive(null)} aria-label="დახურვა">×</button>
   <img src={photos[active].src} alt={`JMC Grand Avenue — ${photos[active].label}`}/>
   <div className="grand-lightbox-controls"><button type="button" onClick={()=>setActive((active+photos.length-1)%photos.length)} aria-label="წინა ფოტო">←</button>
    <span aria-live="polite">{String(active+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')} · {photos[active].label}</span>
    <button type="button" onClick={()=>setActive((active+1)%photos.length)} aria-label="შემდეგი ფოტო">→</button></div>
  </div>}
 </>;
}
