'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
const chapters=[['pro-story','ისტორია'],['pro-gallery','გალერეა'],['pro-choose','კომპლექტაციები']] as const;
export function ProPageNavigation(){
 const [progress,setProgress]=useState(0);
 const [active,setActive]=useState<string>('pro-story');
 useEffect(()=>{
  let frame=0;
  const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   const max=document.documentElement.scrollHeight-window.innerHeight;
   setProgress(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0);
   let current:string=chapters[0][0];
   for(const [id] of chapters){const e=document.getElementById(id);if(e&&e.getBoundingClientRect().top<window.innerHeight*.38)current=id}
   setActive(current);
  })};
  update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update)};
 },[]);
 return <nav className="pro-page-nav" aria-label="Grand Avenue PRO — სექციები"><div className="pro-draft-wrap pro-page-nav-inner"><a className="pro-page-nav-title" href="#pro-top">GRAND AVENUE PRO</a><div className="pro-page-nav-chapters">{chapters.map(([id,label])=><a key={id} href={'#'+id} aria-current={active===id?'location':undefined}>{label}</a>)}</div><Link className="pro-page-nav-cta" href="/test-drive" title="ტესტ-დრაივის ინფორმაცია — ონლაინ დაჯავშნა ამ ეტაპზე მიუწვდომელია">დაჯავშნე Test-Drive ↗</Link></div><div className="pro-page-progress" aria-hidden="true" style={{transform:`scaleX(${progress/100})`}}/></nav>;
}
