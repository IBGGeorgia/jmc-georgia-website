'use client';
import {useEffect} from 'react';

/** Progressive enhancement: content is fully visible without JavaScript. */
export function CompareMotion(){
 useEffect(()=>{
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const elements=Array.from(document.querySelectorAll<HTMLElement>('.jmc-compare-story,.jmc-compare-story-heading,.jmc-compare-guidance,.jmc-compare-workspace-anchor,.jmc-compare-afterword'));
  if(!('IntersectionObserver' in window))return;
  // Only hide items below the first viewport; never animate away visible content.
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}
   }
  },{rootMargin:'0px 0px -45px 0px',threshold:0.05});
  for(const el of elements){
   if(el.getBoundingClientRect().top < window.innerHeight){continue;}
   el.classList.add('jmc-compare-reveal');
   observer.observe(el);
  }
  return ()=>{observer.disconnect();elements.forEach(el=>el.classList.remove('jmc-compare-reveal','is-revealed'));};
 },[]);
 return null;
}
