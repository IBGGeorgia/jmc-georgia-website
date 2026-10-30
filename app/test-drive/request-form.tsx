'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';

const models=[
 {slug:'vigus',name:'JMC VIGUS'},
 {slug:'grand-avenue',name:'JMC Grand Avenue'},
 {slug:'grand-avenue-pro',name:'JMC Grand Avenue PRO'}
];
type Status='idle'|'sending'|'sent'|'error';
export function TestDriveRequestForm({enabled}:{enabled:boolean}){
 const [model,setModel]=useState('vigus');
 const [name,setName]=useState('');
 const [phone,setPhone]=useState('');
 const [day,setDay]=useState('');
 const [consent,setConsent]=useState(false);
 const [marketing,setMarketing]=useState(false);
 const [status,setStatus]=useState<Status>('idle');
 const [message,setMessage]=useState('');
 const [source,setSource]=useState<Record<string,string>>({});
 useEffect(()=>{
  const p=new URLSearchParams(window.location.search);
  setSource({utmSource:p.get('utm_source')||'',utmMedium:p.get('utm_medium')||'',
   utmCampaign:p.get('utm_campaign')||'',utmContent:p.get('utm_content')||'',
   referrer:document.referrer?(()=>{try{return new URL(document.referrer).origin}catch{return ''}})():''});
 },[]);
 const today=new Date().toLocaleDateString('sv-SE',{timeZone:'Asia/Tbilisi'});
 async function submit(event:React.FormEvent){
  event.preventDefault();if(!enabled||status==='sending')return;
  setStatus('sending');setMessage('');
  const normalized=phone.trim().replace(/[\s()-]/g,'');
  const formatted=/^5\d{8}$/.test(normalized)?'+995'+normalized:normalized;
  try{
   const res=await fetch('/api/test-drive',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({fullName:name,phone:formatted,model,preferredDate:day,
     consent,marketingOptIn:marketing,honeypot:'',...source})
   });
   if(!res.ok){
    setStatus('error');setMessage(res.status===503?'ონლაინ განაცხადები ჯერ არ მიიღება.':'გთხოვთ, გადაამოწმოთ მონაცემები და სცადოთ თავიდან.');
    return;
   }
   setStatus('sent');setMessage('მოთხოვნა მიღებულია. წარმომადგენელი დაგიკავშირდება დროის შესათანხმებლად.');
   setName('');setPhone('');setDay('');setConsent(false);setMarketing(false);
   // Never send name, phone, booking date or lead ID to analytics.
   const w=window as Window & {dataLayer?:Array<Record<string,string>>};
   w.dataLayer?.push({event:'test_drive_lead_submitted',model_slug:model});
  }catch{setStatus('error');setMessage('კავშირი ვერ დამყარდა. სცადეთ მოგვიანებით.')}
 }
 return <section className="jmc-lead-form-section" aria-labelledby="test-drive-request-title">
  <div className="jmc-lead-form-intro">
   <p className="eyebrow">ტესტ-დრაივის მოთხოვნა</p>
   <h2 id="test-drive-request-title">დაგეგმე პირველი შეხვედრა</h2>
   <p>აირჩიე მოდელი და დატოვე საკონტაქტო ინფორმაცია. სასურველ დროს ჩვენი გუნდი დაგიდასტურებს.</p>
   {!enabled&&<p className="jmc-lead-unavailable" role="status">ფორმა მზადდება — ამ ეტაპზე მონაცემების გაგზავნა გამორთულია.</p>}
  </div>
  <form className="jmc-lead-form" onSubmit={submit} aria-busy={status==='sending'}>
   <fieldset disabled={!enabled||status==='sending'}>
    <div className="jmc-lead-form-grid">
     <label className="jmc-lead-field">
      <span>ავტომობილი</span>
      <select name="model" value={model} onChange={e=>setModel(e.target.value)}>
       {models.map(m=><option key={m.slug} value={m.slug}>{m.name}</option>)}
      </select>
     </label>
     <label className="jmc-lead-field">
      <span>სასურველი თარიღი <small>არასავალდებულო</small></span>
      <input name="preferredDate" type="date" min={today} value={day} onChange={e=>setDay(e.target.value)}/>
     </label>
     <label className="jmc-lead-field">
      <span>სახელი და გვარი</span>
      <input name="fullName" autoComplete="name" required maxLength={100} minLength={2}
       value={name} onChange={e=>setName(e.target.value)} placeholder="შეიყვანე სახელი და გვარი"/>
     </label>
     <label className="jmc-lead-field">
      <span>ტელეფონის ნომერი</span>
      <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required
       value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+995 5XX XX XX XX"/>
     </label>
    </div>
    <label className="jmc-lead-check">
     <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} required/>
     <span>ვეთანხმები ჩემი მონაცემების დამუშავებას ტესტ-დრაივის მოთხოვნაზე დასაკავშირებლად. <Link href="/privacy">კონფიდენციალურობა</Link></span>
    </label>
    <label className="jmc-lead-check">
     <input type="checkbox" checked={marketing} onChange={e=>setMarketing(e.target.checked)}/>
     <span>მსურს შეთავაზებებისა და სიახლეების მიღება. (არასავალდებულო)</span>
    </label>
    <div className="jmc-lead-form-bottom">
     <button className="button" disabled={!enabled||status==='sending'||!consent} type="submit">
      {status==='sending'?'იგზავნება…':'გაგზავნე მოთხოვნა'} <span aria-hidden="true">↗</span>
     </button>
     <p>განაცხადის გაგზავნა არ ნიშნავს დაჯავშნის დროის ავტომატურ დადასტურებას.</p>
    </div>
   </fieldset>
   {message&&<p role="status" className={status==='sent'?'jmc-lead-success':'jmc-lead-error'}>{message}</p>}
  </form>
 </section>;
}
