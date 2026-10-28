'use client';
import {useEffect} from 'react';

/**
 * Vigus-specific cinematic motion. Static HTML stays visible if JavaScript,
 * GSAP or IntersectionObserver is unavailable. Everything tears down on unmount.
 */
export function VigusMotion(){
 useEffect(()=>{
  const root=document.querySelector<HTMLElement>('.vigus-experience');
  if(!root)return;

  const menu=Array.from(root.querySelectorAll<HTMLAnchorElement>('.vigus-local-inner a[href^="#"]'))
   .filter(link=>link.hash&&link.hash!=='#top');
  const sections=menu.map(link=>({link,element:root.querySelector<HTMLElement>(link.hash)}))
   .filter((item):item is {link:HTMLAnchorElement;element:HTMLElement}=>Boolean(item.element));
  let frame=0;
  const update=()=>{
   frame=0;
   const cutoff=window.scrollY+(window.innerWidth<=700?68:82)+90;
   let active:HTMLElement|null=null;
   sections.forEach(section=>{
    if(section.element.getBoundingClientRect().top+window.scrollY<=cutoff)active=section.element;
   });
   sections.forEach(({link,element})=>{
    if(active===element)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
   });
  };
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  update();

  let disposed=false;
  let teardown=()=>{};
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  if(!preference.matches){
   const initialize=async()=>{
    try{
     const [{default:gsap},{ScrollTrigger},{SplitText}]=await Promise.all([
      import('gsap'),import('gsap/ScrollTrigger'),import('gsap/SplitText')
     ]);
     if(disposed)return;
     gsap.registerPlugin(ScrollTrigger,SplitText);
     const splitInstances:Array<{revert:()=>void}>=[];
     const ctx=gsap.context(()=>{
      // Entrance for text blocks with a mask; never split individual Georgian letters.
      const headings=Array.from(root.querySelectorAll<HTMLElement>(
       '.vigus-section-heading h2,.vigus-cinema-overlay h2,.vigus-final h2'
      ));
      for(const element of headings){
       if(element.closest('#technology'))continue;
       const split=SplitText.create(element,{
        type:'lines',mask:'lines',autoSplit:true,
        onSplit(instance){
         return gsap.from(instance.lines,{
          yPercent:110,opacity:0,duration:.95,stagger:.12,ease:'power3.out',
          scrollTrigger:{trigger:element,start:'top 88%',once:true}
         });
        }
       });
       splitInstances.push(split);
      }

      // Scroll-driven word illumination is reserved for a single editorial headline.
      const illuminated=root.querySelector<HTMLElement>('#technology .vigus-section-heading h2');
      if(illuminated){
       const split=SplitText.create(illuminated,{type:'words',wordsClass:'vigus-ink-word'});
       splitInstances.push(split);
       gsap.fromTo(split.words,{color:'rgba(25,27,30,.27)'},{
        color:'rgba(25,27,30,.94)',stagger:.18,ease:'none',
        scrollTrigger:{
         trigger:illuminated,start:'top 86%',end:'bottom 52%',
         scrub:.55
        }
       });
      }

      // Supporting content enters in a consistent rhythm.
      const blocks=root.querySelectorAll<HTMLElement>(
       '[data-vigus-reveal]:not(.vigus-cinema):not(.vigus-section-heading)'
      );
      blocks.forEach(element=>{
       gsap.fromTo(element,{y:28,opacity:0},{
        y:0,opacity:1,duration:.9,ease:'power2.out',
        scrollTrigger:{trigger:element,start:'top 91%',once:true}
       });
      });
      root.querySelectorAll<HTMLElement>('.vigus-section-heading').forEach(heading=>{
       const label=heading.querySelector('.vigus-eyebrow');
       const description=heading.querySelector('p');
       if(label)gsap.from(label,{y:10,opacity:0,duration:.6,ease:'power2.out',
        scrollTrigger:{trigger:heading,start:'top 91%',once:true}});
       if(description)gsap.from(description,{y:18,opacity:0,duration:.75,ease:'power2.out',
        scrollTrigger:{trigger:heading,start:'top 88%',once:true}});
      });

      // Image container expands elegantly; the original image file stays untouched.
      const cinematic=root.querySelector<HTMLElement>('.vigus-cinema');
      if(cinematic){
       gsap.fromTo(cinematic,{clipPath:'inset(0% 7% round 22px)'},{
        clipPath:'inset(0% 0% round 0px)',ease:'none',
        scrollTrigger:{trigger:cinematic,start:'top 95%',end:'center 54%',scrub:1.05}
       });
       const image=cinematic.querySelector('img');
       if(image)gsap.fromTo(image,{scale:1.09},{scale:1,ease:'none',
        scrollTrigger:{trigger:cinematic,start:'top bottom',end:'bottom top',scrub:1.25}});
      }

      // Preserve numeric truth while introducing a restrained count-up on first visit.
      root.querySelectorAll<HTMLElement>('[data-vigus-count]').forEach(element=>{
       const target=Number(element.dataset.vigusCount);
       if(!Number.isFinite(target))return;
       const decimals=target%1===0?0:1;
       ScrollTrigger.create({
        trigger:element,start:'top 90%',once:true,
        onEnter(){
         const value={n:0};
         gsap.to(value,{n:target,duration:1.25,ease:'power2.out',
          onUpdate(){element.textContent=value.n.toFixed(decimals)},
          onComplete(){element.textContent=target.toFixed(decimals)}
         });
        }
       });
      });

      // Subtle pinned-photo depth, no wheel hijack and no full-screen forced pin.
      const story=root.querySelector<HTMLElement>('.vigus-storytelling');
      const stage=story?.querySelector<HTMLElement>('.vigus-highlight-stage');
      if(story&&stage){
       gsap.fromTo(stage,{y:10},{y:-10,ease:'none',
        scrollTrigger:{trigger:story,start:'top 75%',end:'bottom 30%',scrub:1}});
      }
      ScrollTrigger.refresh();
     },root);
     teardown=()=>{ctx.revert();splitInstances.forEach(instance=>instance.revert())};
    }catch(error){
     // The page remains fully usable without optional motion enhancement.
     console.warn('Vigus motion unavailable; displaying static content.',error);
    }
   };
   void initialize();
  }
  return ()=>{
   disposed=true;
   teardown();
   window.removeEventListener('scroll',onScroll);
   window.removeEventListener('resize',onScroll);
   if(frame)cancelAnimationFrame(frame);
   menu.forEach(link=>link.removeAttribute('aria-current'));
  };
 },[]);
 return null;
}
