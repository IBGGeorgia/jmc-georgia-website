'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
const slides=[
 {file:'side',label:'პროფილი'},
 {file:'rear',label:'უკანა ხედი'},
 {file:'dashboard',label:'მაჩვენებლების პანელი'},
 {file:'console',label:'კონსოლი'},
 {file:'adventure-3',label:'მოძრაობაში'}
];
export function VigusGallery(){
 const rail=useRef<HTMLDivElement>(null);
 const wheelTarget=useRef<number|null>(null);
 const wheelRaf=useRef<number|null>(null);
 const drag=useRef<{x:number;scroll:number;active:boolean}>({x:0,scroll:0,active:false});
 const [current,setCurrent]=useState(0);
 const [canPrev,setCanPrev]=useState(false),[canNext,setCanNext]=useState(true);
 const sync=useCallback(()=>{const el=rail.current;if(!el)return;setCanPrev(el.scrollLeft>5);setCanNext(el.scrollLeft+el.clientWidth<el.scrollWidth-5);const cards=[...el.querySelectorAll<HTMLElement>('figure')];const center=el.scrollLeft+el.clientWidth/2;let idx=0,min=Infinity;cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-center);if(d<min){idx=i;min=d}});setCurrent(idx)},[]);
 useEffect(()=>{
  const el=rail.current;if(!el)return;sync();
  const ro=new ResizeObserver(sync);ro.observe(el);
  let lastWheel=0;
  const animate=()=>{
   const target=wheelTarget.current;if(target===null)return;
   const distance=target-el.scrollLeft;
   if(Math.abs(distance)<.65){el.scrollLeft=target;wheelRaf.current=null;wheelTarget.current=null;return;}
   el.scrollLeft+=distance*.19;
   wheelRaf.current=requestAnimationFrame(animate);
  };
  const wheel=(event:WheelEvent)=>{
   if(event.ctrlKey||event.metaKey||event.altKey||!event.cancelable)return;
   const delta=event.shiftKey&&event.deltaX===0?event.deltaY:(Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY);
   const normalized=delta*(event.deltaMode===1?18:event.deltaMode===2?el.clientWidth:1);
   if(!normalized||el.scrollWidth<=el.clientWidth)return;
   const now=performance.now();
   const max=el.scrollWidth-el.clientWidth;
   if(now-lastWheel>300&&wheelTarget.current===null)wheelTarget.current=el.scrollLeft;
   lastWheel=now;
   const start=wheelTarget.current??el.scrollLeft;
   const target=Math.max(0,Math.min(max,start+normalized*1.25));
   if(Math.abs(target-start)<.1)return;
   event.preventDefault();
   wheelTarget.current=target;
   if(wheelRaf.current===null)wheelRaf.current=requestAnimationFrame(animate);
  };
  el.addEventListener('wheel',wheel,{passive:false});
  return ()=>{ro.disconnect();el.removeEventListener('wheel',wheel);if(wheelRaf.current!==null)cancelAnimationFrame(wheelRaf.current);wheelRaf.current=null;wheelTarget.current=null};
 },[sync]);
 const next=(direction:number)=>{const el=rail.current;if(!el)return;if(wheelRaf.current!==null)cancelAnimationFrame(wheelRaf.current);wheelRaf.current=null;wheelTarget.current=null;const item=el.querySelector('figure');el.scrollBy({left:direction*(item?.getBoundingClientRect().width??el.clientWidth*.8)+direction*20,behavior:'smooth'})};
 return <div className="vigus-gallery-component">
 <div className="vigus-gallery-controls"><span className="vigus-gallery-index" aria-live="polite">{String(current+1).padStart(2,'0')} <span>/ {String(slides.length).padStart(2,'0')}</span></span><div><button type="button" aria-label="წინა ფოტო" disabled={!canPrev} onClick={()=>next(-1)}>←</button><button type="button" aria-label="შემდეგი ფოტო" disabled={!canNext} onClick={()=>next(1)}>→</button></div></div>
 <div ref={rail} className="vigus-gallery-strip vigus-gallery-interactive" tabIndex={0} role="region" aria-label="Vigus-ის ფოტოების გალერეა" onScroll={sync}
 onPointerDown={event=>{if(event.pointerType==='mouse'&&event.button===0){const el=rail.current;if(!el)return;drag.current={x:event.clientX,scroll:el.scrollLeft,active:true};el.setPointerCapture(event.pointerId)}}}
 onPointerMove={event=>{if(!drag.current.active||!rail.current)return;rail.current.scrollLeft=drag.current.scroll-(event.clientX-drag.current.x)}}
 onPointerUp={event=>{drag.current.active=false;if(rail.current?.hasPointerCapture(event.pointerId))rail.current.releasePointerCapture(event.pointerId)}}
 onPointerCancel={()=>{drag.current.active=false}}>
 {slides.map(s=><figure key={s.file}><img src={`/images/vigus/${s.file}.webp`} alt={`JMC Vigus — ${s.label}`} draggable={false} loading="lazy"/><figcaption>{s.label}</figcaption></figure>)}
 </div><p className="vigus-gallery-hint">დაათვალიერე ისრებით ან გადაადგილდი მაუსით</p></div>;
}
