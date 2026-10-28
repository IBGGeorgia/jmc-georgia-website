'use client';
import {useEffect,useRef,useState} from 'react';

export type EditorialScene={
 label:string;title:string;body:string;
 media:'exterior'|'interior'|'safety'|'capability';
};
export type EditorialMedia=Partial<Record<'hero'|'exterior'|'interior'|'safety'|'capability'|'front'|'side'|'rear'|'detail',string>>;

/** Reusable verified-photo story, never simulates 360° or changes supplied vehicle details. */
export function BrochureStory({
 model,scenes,media
}:{model:string;scenes:readonly EditorialScene[];media:EditorialMedia}){
 const [active,setActive]=useState(0);
 const region=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=region.current;
  if(!root)return;
  const match=window.matchMedia('(min-width:961px)');
  if(!match.matches)return;
  const targets=Array.from(root.querySelectorAll<HTMLElement>('[data-scene-index]'));
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting){
     const value=Number((entry.target as HTMLElement).dataset.sceneIndex);
     if(Number.isInteger(value))setActive(value);
    }
   }
  },{rootMargin:'-37% 0px -38% 0px',threshold:0.05});
  targets.forEach(target=>observer.observe(target));
  return ()=>observer.disconnect();
 },[]);
 const choose=(i:number)=>{
  setActive(i);
  if(window.matchMedia('(min-width:961px)').matches){
   const target=region.current?.querySelector<HTMLElement>(`[data-scene-index="${i}"]`);
   target?.scrollIntoView({
    block:'center',
    behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'
   });
  }
 };
 const current=scenes[active];
 const scenesWithPhotos=scenes.filter(scene=>Boolean(media[scene.media]));
 return <div className="brochure-story" ref={region} data-model-reveal>
  <div className="brochure-story-visual" aria-live="off">
   {scenesWithPhotos.length>0?
    scenesWithPhotos.map(scene=><img key={scene.media} src={media[scene.media]} alt={scene.title}
      loading="lazy" decoding="async" aria-hidden={scene.media!==current.media}
      className={scene.media===current.media?'is-active':''}/>):
    <div className="brochure-story-no-media" aria-hidden="true">
     <span>JMC</span><strong>{model}</strong>
    </div>
   }
   <span className="brochure-story-counter" aria-hidden="true">
    {String(active+1).padStart(2,'0')} / {String(scenes.length).padStart(2,'0')}
   </span>
  </div>
  <div className="brochure-story-content">
   <div className="brochure-story-tabs" role="tablist" aria-label={`${model} — დეტალები`}>
    {scenes.map((scene,i)=><button key={scene.media} type="button"
     id={`brochure-scene-${i}`} role="tab" data-scene-index={i}
     aria-selected={i===active} aria-controls="brochure-active-scene"
     tabIndex={i===active?0:-1}
     className={i===active?'is-active':''}
     onClick={()=>choose(i)}
     onKeyDown={event=>{
      let next=i;
      if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(i+1)%scenes.length;
      else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(i-1+scenes.length)%scenes.length;
      else if(event.key==='Home')next=0;
      else if(event.key==='End')next=scenes.length-1;
      else return;
      event.preventDefault();
      choose(next);
      event.currentTarget.parentElement
       ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
     }}>
     <span className="brochure-scene-index">{String(i+1).padStart(2,'0')}</span>
     <span><strong>{scene.title}</strong><small>{scene.label}</small></span>
    </button>)}
   </div>
   <div className="brochure-scene-caption" id="brochure-active-scene"
     role="tabpanel" aria-labelledby={`brochure-scene-${active}`} tabIndex={0}>
    <p className="brochure-kicker">{current.label}</p>
    <h3>{current.title}</h3>
    <p>{current.body}</p>
   </div>
  </div>
 </div>;
}
