'use client';
import {useEffect} from 'react';

/** Shared brochure model motion; respects reduced-motion and degrades to static content. */
export function BrochureModelMotion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.brochure-model');
  if(!root)return;
  const bar=root.querySelector<HTMLElement>('.vigus-scroll-progress-fill');
  const links=Array.from(root.querySelectorAll<HTMLAnchorElement>('.model-local-nav a[href^="#"]'))
   .filter(link=>link.hash!=='#top');
  let frame=0;
  const update=()=>{
   frame=0;
   const top=root.getBoundingClientRect().top+window.scrollY;
   const length=Math.max(1,root.offsetHeight-window.innerHeight);
   const progress=Math.min(1,Math.max(0,(window.scrollY-top)/length));
   if(bar)bar.style.transform=`scaleX(${progress})`;
   const position=window.scrollY+(window.innerWidth<=700?160:190);
   let active:string|undefined;
   for(const link of links){
    const element=root.querySelector<HTMLElement>(link.hash);
    if(element&&element.getBoundingClientRect().top+window.scrollY<=position)active=link.hash;
   }
   for(const link of links){
    if(active===link.hash)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
   }
  };
  const onScroll=()=>{if(!frame)frame=window.requestAnimationFrame(update)};
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  update();
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveals=Array.from(root.querySelectorAll<HTMLElement>('[data-model-reveal]'));
  let observer:IntersectionObserver|undefined;
  let gsapCleanup=()=>{};
  let disposed=false;
  if(!media.matches&&'IntersectionObserver' in window){
   for(const element of reveals){
    if(element.getBoundingClientRect().top<window.innerHeight*.93){
     element.classList.add('is-visible');
    }
   }
   observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
     if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      observer?.unobserve(entry.target);
     }
    }
   },{rootMargin:'0px 0px -7% 0px',threshold:0.06});
   reveals.filter(element=>!element.classList.contains('is-visible'))
    .forEach(element=>observer?.observe(element));
   root.dataset.motionReady='true';
   const run=async()=>{
    try{
     const [{default:gsap},{ScrollTrigger},{SplitText}]=await Promise.all([
      import('gsap'),import('gsap/ScrollTrigger'),import('gsap/SplitText')
     ]);
     if(disposed)return;
     gsap.registerPlugin(ScrollTrigger,SplitText);
     const splits:Array<{revert:()=>void}>=[];
     const ctx=gsap.context(()=>{
      gsap.from('.brochure-hero-copy>*',{
       y:24,opacity:0,duration:.8,stagger:.1,ease:'power3.out',
       clearProps:'all'
      });
      const heroImage=root.querySelector<HTMLImageElement>('.brochure-hero-visual img');
      if(heroImage)gsap.fromTo(heroImage,{scale:1.07},{
       scale:1,ease:'none',
       scrollTrigger:{trigger:heroImage,start:'top bottom',end:'bottom top',scrub:1.1}
      });
      root.querySelectorAll<HTMLElement>('.model-section-heading h2').forEach(heading=>{
       const split=SplitText.create(heading,{
        type:'lines',mask:'lines',autoSplit:true,
        onSplit(instance){
         return gsap.from(instance.lines,{
          yPercent:110,opacity:0,duration:.85,stagger:.1,ease:'power3.out',
          scrollTrigger:{trigger:heading,start:'top 88%',once:true}
         });
        }
       });
       splits.push(split);
      });
     },root);
     gsapCleanup=()=>{ctx.revert();splits.forEach(split=>split.revert())};
    }catch(error){
     console.warn('Brochure model: optional cinematic animation unavailable',error);
    }
   };
   void run();
  }
  return ()=>{
   disposed=true;
   gsapCleanup();
   observer?.disconnect();
   window.removeEventListener('scroll',onScroll);
   window.removeEventListener('resize',onScroll);
   if(frame)cancelAnimationFrame(frame);
   root.removeAttribute('data-motion-ready');
   links.forEach(link=>link.removeAttribute('aria-current'));
  };
 },[]);
 return null;
}
