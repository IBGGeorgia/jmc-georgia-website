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
export function Footer(){
 return <footer className="footer jmc-footer">
  <div className="container jmc-footer-inner">
   <div className="jmc-footer-main">
    <div className="jmc-footer-brand-column">
     <div className="jmc-footer-brand"><img src="/brand/jmc-logo-white.svg" width={148} height={46} alt="JMC"/><span>Georgia</span></div>
     <p className="jmc-footer-description">JMC-ის ოფიციალური წარმომადგენლობა საქართველოში.</p>
     <Link href="/test-drive" className="jmc-footer-cta">დაჯავშნე ტესტ-დრაივი <span aria-hidden="true">↗</span></Link>
    </div>
    <nav className="jmc-footer-column" aria-label="ქვედა ნავიგაცია">
     <h2>ნავიგაცია</h2>
     <Link href="/vehicles/vigus">JMC Vigus</Link>
     <Link href="/test-drive">ტესტ-დრაივი</Link>
     <Link href="/about">ჩვენ შესახებ</Link>
     <Link href="/contact">კონტაქტი</Link>
    </nav>
    <div className="jmc-footer-column jmc-footer-contact">
     <h2>მისამართი</h2>
     <address>თბილისი, ბელიაშვილის 115</address>
     <p className="jmc-footer-contact-note">JMC Georgia</p>
    </div>
    <div className="jmc-footer-column jmc-footer-social-column">
     <h2>სოციალური ქსელები</h2>
     <div className="jmc-footer-socials" aria-label="სოციალური ქსელების ბმულები მოგვიანებით დაემატება">
      <span className="jmc-social-icon" aria-label="Facebook — ბმული მალე დაემატება" title="Facebook">
       <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M13.8 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.8V3.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.7v1.9H7.3v3.2h2.7V21h3.8Z"/></svg>
      </span>
      <span className="jmc-social-icon" aria-label="Instagram — ბმული მალე დაემატება" title="Instagram">
       <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>
      </span>
      <span className="jmc-social-icon" aria-label="LinkedIn — ბმული მალე დაემატება" title="LinkedIn">
       <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M5.2 8.6H2.4V21h2.8V8.6ZM3.8 3a1.65 1.65 0 1 0 0 3.3A1.65 1.65 0 0 0 3.8 3ZM21.6 13.6c0-3.3-1.7-5.1-4.2-5.1-1.9 0-2.8 1.1-3.2 1.8V8.6h-2.8V21h2.8v-6.8c0-1.8.7-2.8 2.1-2.8 1.4 0 2 .9 2 2.8V21h3.3v-7.4Z"/></svg>
      </span>
     </div>
     <p className="jmc-footer-contact-note">გამოგვყევი სიახლეებისთვის</p>
    </div>
   </div>
   <div className="jmc-footer-bottom">
    <span>© {new Date().getFullYear()} JMC Georgia. ყველა უფლება დაცულია.</span>
    <Link href="/privacy">კონფიდენციალურობა</Link>
    <span className="jmc-footer-signature">Driven by possibilities.</span>
   </div>
  </div>
 </footer>;
}
