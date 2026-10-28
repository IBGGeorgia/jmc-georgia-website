'use client';
import {useEffect} from 'react';

/** Progressive enhancement: content is visible by default without JavaScript.
 *  Reveal and progress affordances only activate after client hydration.
 */
export function VigusMotion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.vigus-experience');
  if(!root)return;
  const bar=root.querySelector<HTMLElement>('.vigus-scroll-progress-fill');
  const links=Array.from(root.querySelectorAll<HTMLAnchorElement>('.vigus-local-inner a[href^="#"]'))
   .filter(link=>link.getAttribute('href')!=='#top');
  const sections=links.map(link=>({
   link,element:document.getElementById(link.hash.slice(1))
  })).filter((pair):pair is {link:HTMLAnchorElement;element:HTMLElement}=>Boolean(pair.element));

  let raf=0;
  const paint=()=>{
   raf=0;
   const start=root.getBoundingClientRect().top+window.scrollY;
   const max=Math.max(1,root.offsetHeight-window.innerHeight);
   const progress=Math.max(0,Math.min(1,(window.scrollY-start)/max));
   if(bar)bar.style.transform=`scaleX(${progress})`;
   const top=window.scrollY+(window.innerWidth<=700?68:82)+86;
   let active:HTMLElement|null=null;
   for(const section of sections){
    if(section.element.getBoundingClientRect().top+window.scrollY<=top)active=section.element;
   }
   for(const section of sections){
    if(section.element===active)section.link.setAttribute('aria-current','location');
    else section.link.removeAttribute('aria-current');
   }
  };
  const onScroll=()=>{if(!raf)raf=window.requestAnimationFrame(paint)};
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  paint();

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements=Array.from(root.querySelectorAll<HTMLElement>('[data-vigus-reveal]'));
  let observer:IntersectionObserver|null=null;
  if(!reduced&&'IntersectionObserver' in window){
   const viewport=window.innerHeight;
   for(const element of elements){
    const rect=element.getBoundingClientRect();
    if(rect.top<viewport*.9&&rect.bottom>0)element.classList.add('is-visible');
   }
   observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
     if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer?.unobserve(entry.target);
     }
    }
   },{rootMargin:'0px 0px -7% 0px',threshold:0.08});
   elements.filter(element=>!element.classList.contains('is-visible'))
    .forEach(element=>observer?.observe(element));
   root.dataset.motionReady='true';
  }
  return ()=>{
   window.removeEventListener('scroll',onScroll);
   window.removeEventListener('resize',onScroll);
   if(raf)window.cancelAnimationFrame(raf);
   observer?.disconnect();
   root.removeAttribute('data-motion-ready');
   links.forEach(link=>link.removeAttribute('aria-current'));
  };
 },[]);
 return null;
}
