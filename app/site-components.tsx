'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';

const links=[
 {href:'/',label:'მთავარი'},
 {href:'/vehicles',label:'ავტომობილები'},
 {href:'/vehicles/vigus',label:'JMC Vigus'},
 {href:'/vehicles/grand-avenue',label:'JMC Grand Avenue'},
 {href:'/about',label:'ჩვენ შესახებ'},
 {href:'/contact',label:'კონტაქტი'}
];

export function Header(){
 const [open,setOpen]=useState(false);
 const pathname=usePathname();
 const triggerRef=useRef<HTMLButtonElement>(null);
 const dialogRef=useRef<HTMLDivElement>(null);

 useEffect(()=>{
  if(!open)return;
  const previousOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  const background=[document.querySelector('.site-header'),document.querySelector('main'),document.querySelector('footer')]
   .filter((node):node is HTMLElement=>node instanceof HTMLElement);
  const previousInert=background.map(node=>node.inert);
  background.forEach(node=>{node.inert=true});
  const panel=dialogRef.current;
  panel?.querySelector<HTMLButtonElement>('.jmc-drawer-close')?.focus();

  function onKeyDown(event:KeyboardEvent){
   if(event.key==='Escape'){
    event.preventDefault();
    setOpen(false);
    return;
   }
   if(event.key!=='Tab'||!panel)return;
   const focusables=Array.from(panel.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])'))
    .filter(element=>element.getClientRects().length>0);
   if(!focusables.length){event.preventDefault();panel.focus();return}
   const first=focusables[0];
   const last=focusables[focusables.length-1];
   if(event.shiftKey&&(document.activeElement===first||!panel.contains(document.activeElement))){
    event.preventDefault();last.focus();
   }else if(!event.shiftKey&&(document.activeElement===last||!panel.contains(document.activeElement))){
    event.preventDefault();first.focus();
   }
  }
  document.addEventListener('keydown',onKeyDown);
  return ()=>{
   document.removeEventListener('keydown',onKeyDown);
   document.body.style.overflow=previousOverflow;
   background.forEach((node,i)=>{node.inert=previousInert[i]});
   triggerRef.current?.focus();
  };
 },[open]);

 return <>
  <header className="site-header jmc-header">
   <div className="container jmc-header-inner">
    <button ref={triggerRef} type="button" className="jmc-menu-trigger"
     aria-label={open?'მენიუს დახურვა':'მენიუს გახსნა'}
     aria-controls="jmc-navigation-panel" aria-expanded={open}
     onClick={()=>setOpen(value=>!value)}>
     <span className={open?'jmc-menu-icon is-open':'jmc-menu-icon'} aria-hidden="true"><i/><i/></span>
    </button>
    <Link href="/" className="jmc-centered-logo" aria-label="JMC Georgia — მთავარი">
     <img src="/brand/jmc-logo-red.svg" width={130} height={40} alt="JMC"/>
    </Link>
   </div>
  </header>
  <div className="jmc-drawer-shell" hidden={!open}>
   <button type="button" className="jmc-drawer-backdrop" aria-label="მენიუს დახურვა"
    onClick={()=>setOpen(false)}/>
   <div ref={dialogRef} className="jmc-drawer" id="jmc-navigation-panel" role="dialog"
    aria-modal="true" aria-label="JMC Georgia — მენიუ" tabIndex={-1}>
    <div className="jmc-drawer-top">
     <img src="/brand/jmc-logo-red.svg" width={110} height={34} alt="JMC"/>
     <button type="button" className="jmc-drawer-close" onClick={()=>setOpen(false)}
      aria-label="დახურვა">×</button>
    </div>
    <p className="jmc-drawer-eyebrow">JMC Georgia / Menu</p>
    <nav className="jmc-drawer-links" aria-label="ძირითადი ნავიგაცია">
     {links.map((item,i)=>
      <Link key={item.href} href={item.href} aria-current={pathname===item.href?'page':undefined}
       onClick={()=>setOpen(false)}>
       <span>{String(i+1).padStart(2,'0')}</span>
       {item.label}
       <span aria-hidden="true">↗</span>
      </Link>
     )}
    </nav>
    <Link href="/test-drive" className="button jmc-drawer-drive" onClick={()=>setOpen(false)}>
     ტესტ-დრაივის ინფორმაცია <span aria-hidden="true">↗</span>
    </Link>
    <div className="jmc-drawer-address">
     <span>მისამართი</span>
     <address><Link href="/contact" onClick={()=>setOpen(false)}>თბილისი, ბელიაშვილის 115</Link></address>
    </div>
    <p className="jmc-drawer-foot">JMC Georgia</p>
   </div>
  </div>
 </>;
}
type FooterSocial = {
 name: 'Facebook' | 'Instagram' | 'LinkedIn';
 href: string | null;
};
const footerNavigation = [
 {href:'/vehicles/vigus',label:'JMC Vigus'},
 {href:'/vehicles/grand-avenue',label:'JMC Grand Avenue'},
 {href:'/test-drive',label:'ტესტ-დრაივის ინფორმაცია'},
 {href:'/about',label:'ჩვენ შესახებ'},
 {href:'/contact',label:'კონტაქტი'}
] as const;
// Until the official pages are confirmed, keep href null: decorative, not clickable.
const footerSocials:FooterSocial[]=[
 {name:'Facebook',href:null},
 {name:'Instagram',href:null},
 {name:'LinkedIn',href:null}
];
function FooterSocialIcon({name}:{name:FooterSocial['name']}){
 switch(name){
  case 'Facebook':return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M13.8 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.8V3.1c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.7v1.9H7.3v3.2h2.7V21h3.8Z"/></svg>;
  case 'Instagram':return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg>;
  case 'LinkedIn':return <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor"><path d="M5.2 8.6H2.4V21h2.8V8.6ZM3.8 3a1.65 1.65 0 1 0 0 3.3A1.65 1.65 0 0 0 3.8 3ZM21.6 13.6c0-3.3-1.7-5.1-4.2-5.1-1.9 0-2.8 1.1-3.2 1.8V8.6h-2.8V21h3.3v-7.4Z"/></svg>;
 }
}
export function Footer(){
 return <footer className="footer jmc-footer">
  <div className="container jmc-footer-inner">
   <div className="jmc-footer-main">
    <div className="jmc-footer-brand-column">
     <div className="jmc-footer-brand">
      <img src="/brand/jmc-logo-white.svg" width={148} height={46} alt="JMC"/>
      <span>Georgia</span>
     </div>
     <p className="jmc-footer-description">JMC-ის ოფიციალური წარმომადგენლობა საქართველოში.</p>
     <Link href="/vehicles/vigus" className="jmc-footer-cta">
      აღმოაჩინე JMC Vigus <span aria-hidden="true">↗</span>
     </Link>
    </div>
    <nav className="jmc-footer-column jmc-footer-navigation" aria-label="ქვედა ნავიგაცია">
     <h2>ნავიგაცია</h2>
     {footerNavigation.map(item=><Link key={item.href} href={item.href}>{item.label}</Link>)}
    </nav>
    <div className="jmc-footer-column jmc-footer-contact">
     <h2>მისამართი</h2>
     <address>თბილისი, ბელიაშვილის 115</address>
    </div>
    <div className="jmc-footer-column jmc-footer-social-column">
     <h2>სოციალური ქსელები</h2>
     <div className="jmc-footer-socials" role="group" aria-label="სოციალური ქსელების პროფილები">
      {footerSocials.map(profile=>profile.href
       ?<a key={profile.name} className="jmc-social-icon jmc-social-link" href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={profile.name} title={profile.name}>
         <FooterSocialIcon name={profile.name}/>
        </a>
       :<span key={profile.name} className="jmc-social-icon" role="img" aria-label={profile.name} title={profile.name}>
         <FooterSocialIcon name={profile.name}/>
        </span>)}
     </div>
    </div>
   </div>
   <div className="jmc-footer-bottom">
    <span>© {new Date().getFullYear()} JMC Georgia. ყველა უფლება დაცულია.</span>
    <Link href="/privacy">კონფიდენციალურობა</Link>
   </div>
  </div>
 </footer>;
}
