'use client';
import {useEffect,useRef,useState} from 'react';
import {grandAvenueProOriginalMedia as media} from '../../../lib/grand-avenue-pro-media';
const frames=[media.rear,media.exterior,media.frontDetail,media.hero];
export function GrandAvenueProGallery(){
 const [active,setActive]=useState<number|null>(null);
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 const dialog=useRef<HTMLDivElement>(null);
 const origin=useRef<number|null>(null);
 const touchX=useRef<number|null>(null);
 useEffect(()=>{
  if(active===null)return;
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setActive(null)}else if(e.key==='ArrowRight'){setActive(i=>i===null?null:(i+1)%frames.length)}else if(e.key==='ArrowLeft'){setActive(i=>i===null?null:(i+frames.length-1)%frames.length)}else if(e.key==='Tab'){const focusable=dialog.current?.querySelectorAll<HTMLButtonElement>('button');if(!focusable?.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}}};
  document.addEventListener('keydown',key);const prior=document.body.style.overflow;document.body.style.overflow='hidden';dialog.current?.querySelector('button')?.focus();
  return ()=>{document.removeEventListener('keydown',key);document.body.style.overflow=prior;if(origin.current!==null)buttons.current[origin.current]?.focus();else previous?.focus()};
 },[active!==null]);
 const open=(i:number)=>{origin.current=i;setActive(i)};
 return <><div className="pro-draft-gallery-grid" aria-label="Grand Avenue PRO ფოტოგალერეა">{frames.map((item,i)=><button key={item.original} ref={el=>{buttons.current[i]=el}} type="button" className="pro-premium-gallery-tile" onClick={()=>open(i)} aria-label={item.alt+' — სრულ ეკრანზე'}><img src={item.src} alt={item.alt} loading="lazy"/><span className="pro-premium-gallery-zoom" aria-hidden="true">↗</span></button>)}</div>
 {active!==null&&<div className="pro-premium-lightbox" role="dialog" aria-modal="true" aria-label="Grand Avenue PRO ფოტოების დათვალიერება" ref={dialog} onTouchStart={e=>{touchX.current=e.touches[0]?.clientX??null}} onTouchEnd={e=>{if(touchX.current===null)return;const dx=e.changedTouches[0].clientX-touchX.current;if(Math.abs(dx)>65)setActive(i=>i===null?null:(i+(dx<0?1:frames.length-1))%frames.length);touchX.current=null}}><button type="button" className="pro-premium-gallery-close" onClick={()=>setActive(null)} aria-label="დახურვა">×</button><img src={frames[active].src} alt={frames[active].alt} draggable={false}/><div className="pro-premium-gallery-nav"><button type="button" aria-label="წინა ფოტო" onClick={()=>setActive(i=>i===null?null:(i+frames.length-1)%frames.length)}>←</button><span>{String(active+1).padStart(2,'0')} / {String(frames.length).padStart(2,'0')}</span><button type="button" aria-label="შემდეგი ფოტო" onClick={()=>setActive(i=>i===null?null:(i+1)%frames.length)}>→</button></div></div>}</>;
}
