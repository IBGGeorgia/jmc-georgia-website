'use client';
import {useEffect} from 'react';

/** Lightweight, progressive enhancement. No hidden content if JS is unavailable. */
export default function HomepageMotion(){
 useEffect(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(media.matches||!('IntersectionObserver' in window))return;
  const selectors=[
   '.home3-lineup .home3-heading',
   '.home3-lineup .home3-model-tabs',
   '.home3-vehicle-stage',
   '.home3-story-intro',
   '.home3-story-tile',
   '.home3-detail-heading',
   '.home3-detail .home3-model-tabs',
   '.home3-detail-stage',
   '.home3-photo-thumbnails',
   '.home3-conversion-content'
  ];
  const nodes=Array.from(document.querySelectorAll<HTMLElement>(selectors.join(',')));
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    entry.target.classList.add('home3-motion-visible');
    observer.unobserve(entry.target);
   }
  },{rootMargin:'0px 0px -28px 0px',threshold:0.07});
  for(const node of nodes){
   // Animate only elements still below the viewport; never flash visible content.
   if(node.getBoundingClientRect().top<window.innerHeight-28)continue;
   node.classList.add('home3-motion-pending');
   observer.observe(node);
  }
  const disable=()=>{if(!media.matches)return;observer.disconnect();nodes.forEach(n=>{n.classList.remove('home3-motion-pending');n.classList.add('home3-motion-visible')})};
  media.addEventListener('change',disable);
  return ()=>{observer.disconnect();media.removeEventListener('change',disable);nodes.forEach(n=>n.classList.remove('home3-motion-pending','home3-motion-visible'))};
 },[]);
 return null;
}
