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
 const drag=useRef<{x:number;scroll:number;active:boolean}>({x:0,scroll:0,active:false});
 const [current,setCurrent]=useState(0);
 const [canPrev,setCanPrev]=useState(false),[canNext,setCanNext]=useState(true);
 const sync=useCallback(()=>{const el=rail.current;if(!el)return;setCanPrev(el.scrollLeft>5);setCanNext(el.scrollLeft+el.clientWidth<el.scrollWidth-5);const cards=[...el.querySelectorAll<HTMLElement>('figure')];const center=el.scrollLeft+el.clientWidth/2;let idx=0,min=Infinity;cards.forEach((c,i)=>{const d=Math.abs(c.offsetLeft+c.offsetWidth/2-center);if(d<min){idx=i;min=d}});setCurrent(idx)},[]);
 useEffect(()=>{const el=rail.current;if(!el)return;sync();const ro=new ResizeObserver(sync);ro.observe(el);return ()=>ro.disconnect()},[sync]);
 const next=(direction:number)=>{const el=rail.current;if(!el)return;const item=el.querySelector('figure');el.scrollBy({left:direction*(item?.getBoundingClientRect().width??el.clientWidth*.8)+direction*20,behavior:'smooth'})};
 return <div className="vigus-gallery-component">
 <div className="vigus-gallery-controls"><span className="vigus-gallery-index" aria-live="polite">{String(current+1).padStart(2,'0')} <span>/ {String(slides.length).padStart(2,'0')}</span></span><div><button type="button" aria-label="წინა ფოტო" disabled={!canPrev} onClick={()=>next(-1)}>←</button><button type="button" aria-label="შემდეგი ფოტო" disabled={!canNext} onClick={()=>next(1)}>→</button></div></div>
 <div ref={rail} className="vigus-gallery-strip vigus-gallery-interactive" tabIndex={0} role="region" aria-label="Vigus-ის ფოტოების გალერეა" onScroll={sync}
 onWheel={event=>{if(!event.shiftKey&&Math.abs(event.deltaY)>Math.abs(event.deltaX)){const el=rail.current;if(el&&el.scrollWidth>el.clientWidth){const atLeft=el.scrollLeft<2&&event.deltaY<0;const atRight=el.scrollLeft+el.clientWidth>=el.scrollWidth-2&&event.deltaY>0;if(!atLeft&&!atRight){el.scrollLeft+=event.deltaY;event.preventDefault()}}}}}
 onPointerDown={event=>{if(event.pointerType==='mouse'&&event.button===0){const el=rail.current;if(!el)return;drag.current={x:event.clientX,scroll:el.scrollLeft,active:true};el.setPointerCapture(event.pointerId)}}}
 onPointerMove={event=>{if(!drag.current.active||!rail.current)return;rail.current.scrollLeft=drag.current.scroll-(event.clientX-drag.current.x)}}
 onPointerUp={event=>{drag.current.active=false;if(rail.current?.hasPointerCapture(event.pointerId))rail.current.releasePointerCapture(event.pointerId)}}
 onPointerCancel={()=>{drag.current.active=false}}>
 {slides.map(s=><figure key={s.file}><img src={`/images/vigus/${s.file}.webp`} alt={`JMC Vigus — ${s.label}`} draggable={false} loading="lazy"/><figcaption>{s.label}</figcaption></figure>)}
 </div><p className="vigus-gallery-hint">დაათვალიერე ისრებით ან გადაადგილდი მაუსით</p></div>;
}
