'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
const links=[{href:'/',label:'მთავარი'},{href:'/vehicles/vigus',label:'JMC Vigus'},{href:'/about',label:'ჩვენ შესახებ'},{href:'/contact',label:'კონტაქტი'}];
export function Header(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{if(!open)return;const escape=(event:KeyboardEvent)=>{if(event.key==='Escape')setOpen(false)};document.addEventListener('keydown',escape);const previous=document.body.style.overflow;document.body.style.overflow='hidden';return ()=>{document.removeEventListener('keydown',escape);document.body.style.overflow=previous}},[open]);
 return <><header className="site-header jmc-header"><div className="container jmc-header-inner">
 <button type="button" className="jmc-menu-trigger" aria-label={open?'მენიუს დახურვა':'მენიუს გახსნა'} aria-controls="jmc-navigation-panel" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span className={open?'jmc-menu-icon is-open':'jmc-menu-icon'} aria-hidden="true"><i/><i/></span></button>
 <Link href="/" className="jmc-centered-logo" aria-label="JMC Georgia — მთავარი"><img src="/brand/jmc-logo-red.svg" width={130} height={40} alt="JMC"/></Link>
 <Link href="/test-drive" className="button jmc-header-drive">ტესტ-დრაივი <span aria-hidden="true">↗</span></Link>
 </div></header>
 {open&&<div className="jmc-drawer-shell"><button type="button" className="jmc-drawer-backdrop" aria-label="მენიუს დახურვა" onClick={()=>setOpen(false)}/><nav className="jmc-drawer" id="jmc-navigation-panel" aria-label="ძირითადი ნავიგაცია"><div className="jmc-drawer-top"><img src="/brand/jmc-logo-red.svg" width={110} height={34} alt="JMC"/><button type="button" className="jmc-drawer-close" onClick={()=>setOpen(false)} aria-label="დახურვა">×</button></div><p className="jmc-drawer-eyebrow">JMC Georgia / Menu</p><div className="jmc-drawer-links">{links.map((l,i)=><Link key={l.href} href={l.href} onClick={()=>setOpen(false)}><span>{String(i+1).padStart(2,'0')}</span>{l.label}<span aria-hidden="true">↗</span></Link>)}</div><Link href="/test-drive" className="button jmc-drawer-drive" onClick={()=>setOpen(false)}>ტესტ-დრაივის დაჯავშნა ↗</Link><p className="jmc-drawer-foot">JMC Georgia · Quality · Technology · Service</p></nav></div>}
 </>;
}
export function Footer(){return <footer className="footer"><div className="container"><div className="footer-top"><div><div className="footer-brand"><img src="/brand/jmc-logo-white.svg" width={130} height={40} alt="JMC"/> <span>Georgia</span></div><p>JMC-ის ოფიციალური წარმომადგენლობა საქართველოში.</p></div><nav className="footer-nav" aria-label="ქვედა ნავიგაცია"><Link href="/vehicles/vigus">JMC Vigus</Link><Link href="/test-drive">ტესტ-დრაივი</Link><Link href="/about">ჩვენ შესახებ</Link><Link href="/contact">კონტაქტი</Link></nav></div><div className="footer-bottom"><span>© {new Date().getFullYear()} JMC Georgia</span><Link href="/privacy">კონფიდენციალურობა</Link><span>Quality · Technology · Service</span></div></div></footer>}
