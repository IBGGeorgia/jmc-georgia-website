'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {studioImageFor} from '../../lib/studio-images';
import {vehicles} from '../../lib/vehicles';
type Status='idle'|'sending'|'success'|'error';
export function TestDriveForm({ready}:{ready:boolean}){
 const [model,setModel]=useState('vigus');
 const [fullName,setFullName]=useState('');
 const [phone,setPhone]=useState('');
 const [preferredDate,setDate]=useState('');
 const [consent,setConsent]=useState(false);
 const [marketingOptIn,setMarketingOptIn]=useState(false);
 const [honeypot,setHoneypot]=useState('');
 const [status,setStatus]=useState<Status>('idle');
 const [error,setError]=useState('');
 const [reference,setReference]=useState('');
 useEffect(()=>{
  const url=new URL(window.location.href);
  const slug=url.searchParams.get('model');
  if(vehicles.some(v=>v.slug===slug))setModel(slug!);
 },[]);
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!ready||status==='sending')return;
  setStatus('sending');setError('');
  try{
   const url=new URL(window.location.href);
   const response=await fetch('/api/test-drive',{method:'POST',
    headers:{'Content-Type':'application/json'},cache:'no-store',
    body:JSON.stringify({
     model,fullName,phone,preferredDate,consent,marketingOptIn,honeypot,
     utmSource:url.searchParams.get('utm_source')||'',
     utmMedium:url.searchParams.get('utm_medium')||'',
     utmCampaign:url.searchParams.get('utm_campaign')||'',
     utmContent:url.searchParams.get('utm_content')||'',
     referrer:document.referrer
    })});
   const result=await response.json();
   if(response.status!==201||!result.accepted)throw Error(result.error||'UNAVAILABLE');
   setReference(result.id);setStatus('success');
   const w=window as Window&{dataLayer?:Record<string,unknown>[];gtag?: (...args:unknown[])=>void};
   w.dataLayer?.push({event:'generate_lead',lead_type:'test_drive',model_slug:model});
   w.gtag?.('event','generate_lead',{lead_type:'test_drive',model_slug:model});
  }catch(e){
   const code=e instanceof Error?e.message:'UNAVAILABLE';
   setError(code==='RATE_LIMIT'?'ძალიან ბევრი მოთხოვნაა. მოგვიანებით სცადე.':
    code==='INVALID'?'გადაამოწმე სახელი, ნომერი, თარიღი და თანხმობა.':
    'მოთხოვნის გაგზავნა ვერ მოხერხდა. გთხოვ, მოგვიანებით სცადო.');
   setStatus('error');
  }
 }
 const georgiaDate=(d:Date)=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tbilisi',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
 const today=georgiaDate(new Date());
 const maxDate=georgiaDate(new Date(Date.now()+90*86400000));
 return <section className="jmc-lead-flow" id="test-drive-request" aria-labelledby="jmc-lead-title">
  <div className="jmc-lead-flow-head">
   <div><p className="eyebrow">JMC Georgia / Test Drive</p>
    <h2 id="jmc-lead-title">აირჩიე მოდელი.<br/>დაგეგმე შენი შეხვედრა.</h2>
    <p>გააკეთე არჩევანი და გაგვიზიარე საკონტაქტო ინფორმაცია. მოთხოვნის მიღება ავტომატურად არ ნიშნავს სასურველი დროის დადასტურებას.</p>
   </div>
   <span className={'jmc-lead-availability'+(ready?' is-ready':'')}>{ready?'განაცხადების მიღება აქტიურია':'განაცხადების მიღება ჯერ არ არის აქტიური'}</span>
  </div>
  {status==='success'?<div className="jmc-lead-success" role="status">
   <h3>მოთხოვნა მიღებულია</h3>
   <p>გაყიდვების წარმომადგენელი დაგიკავშირდება დეტალებისა და თავისუფალი დროის შესათანხმებლად.</p>
   <p className="jmc-lead-reference">განაცხადის ID: {reference}</p>
   <Link href="/vehicles" className="button">ავტომობილების დათვალიერება</Link>
  </div>:<form className="jmc-lead-form" onSubmit={submit}>
   <fieldset className="jmc-lead-models"><legend>01 / აირჩიე ავტომობილი</legend>
    <div className="jmc-lead-model-grid">{vehicles.map(v=>
     <label key={v.slug} className={'jmc-lead-model'+(model===v.slug?' is-selected':'')}>
      <input type="radio" name="model" value={v.slug} checked={model===v.slug}
       onChange={()=>setModel(v.slug)}/>
      <img src={studioImageFor(v.slug,v.heroImage)} alt="" loading="lazy"/>
      <span>{v.name}</span>
     </label>)}</div>
   </fieldset>
   <fieldset className="jmc-lead-details" disabled={!ready}><legend>02 / საკონტაქტო ინფორმაცია</legend>
    <div className="jmc-lead-fields">
     <label>სახელი და გვარი <span aria-hidden="true">*</span>
      <input required autoComplete="name" maxLength={100} minLength={2}
       placeholder="სახელი და გვარი" value={fullName} onChange={e=>setFullName(e.target.value)}/></label>
     <label>ტელეფონის ნომერი <span aria-hidden="true">*</span>
      <input required autoComplete="tel" type="tel" inputMode="tel"
       placeholder="+995 5XX XX XX XX" maxLength={24}
       value={phone} onChange={e=>setPhone(e.target.value)}/></label>
     <label>სასურველი დღე <small>(არასავალდებულო)</small>
      <input type="date" min={today} max={maxDate} value={preferredDate} onChange={e=>setDate(e.target.value)}/></label>
    </div>
   </fieldset>
   <div className="jmc-lead-consent">
    <label><input type="checkbox" required disabled={!ready} checked={consent} onChange={e=>setConsent(e.target.checked)}/>
     <span>ვეთანხმები ჩემი საკონტაქტო მონაცემების დამუშავებას ტესტ-დრაივის მოთხოვნაზე დასაკავშირებლად. <Link href="/privacy">კონფიდენციალურობა</Link> *</span></label>
    <label><input type="checkbox" disabled={!ready} checked={marketingOptIn} onChange={e=>setMarketingOptIn(e.target.checked)}/>
     <span>მსურს მივიღო JMC-ის მარკეტინგული შეთავაზებები (არასავალდებულო).</span></label>
   </div>
   <div className="jmc-lead-trap" aria-hidden="true"><label>არ შეავსოთ <input tabIndex={-1} autoComplete="off"
    value={honeypot} onChange={e=>setHoneypot(e.target.value)}/></label></div>
   {!ready&&<p className="jmc-lead-hold" role="status">ტესტ-დრაივის ონლაინ განაცხადები ამ ეტაპზე არ მიიღება. ფორმა მზად არის, მაგრამ ჩართვამდე უნდა დასრულდეს მონაცემთა დაცვისა და გაყიდვების შეტყობინებების კონფიგურაცია.</p>}
   {error&&<p className="jmc-lead-error" role="alert">{error}</p>}
   <div className="jmc-lead-submit"><button className="button" type="submit" disabled={!ready||status==='sending'}>
    {status==='sending'?'მოთხოვნა იგზავნება…':'გაგზავნე Test Drive მოთხოვნა'} <span aria-hidden="true">↗</span>
   </button><small>დაჯავშნა საბოლოოდ დადასტურდება გაყიდვების წარმომადგენელთან.</small></div>
  </form>}
 </section>;
}
