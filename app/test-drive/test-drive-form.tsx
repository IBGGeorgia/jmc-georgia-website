'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {JmcIcon} from '../jmc-icons';
import {studioImageFor} from '../../lib/studio-images';
import {vehicles} from '../../lib/vehicles';

type Status='idle'|'sending'|'success'|'error';
const dateInGeorgia=(date:Date)=>new Intl.DateTimeFormat('sv-SE',{
 timeZone:'Asia/Tbilisi',year:'numeric',month:'2-digit',day:'2-digit'
}).format(date);
const normalizePhone=(value:string)=>{
 const normalized=value.replace(/[\s()\-]/g,'');
 if(/^5\d{8}$/.test(normalized))return '+995'+normalized;
 if(/^9955\d{8}$/.test(normalized))return '+'+normalized;
 return normalized;
};
const validPhone=(value:string)=>/^\+9955\d{8}$/.test(normalizePhone(value));

export function TestDriveForm({ready}:{ready:boolean}){
 const [model,setModel]=useState('vigus');
 const [fullName,setFullName]=useState('');
 const [phone,setPhone]=useState('');
 const [phoneTouched,setPhoneTouched]=useState(false);
 const [preferredDate,setDate]=useState('');
 const [consent,setConsent]=useState(false);
 const [marketingOptIn,setMarketingOptIn]=useState(false);
 const [honeypot,setHoneypot]=useState('');
 const [status,setStatus]=useState<Status>('idle');
 const [error,setError]=useState('');
 const [reference,setReference]=useState('');
 const selected=vehicles.find(v=>v.slug===model)??vehicles[0];
 const today=dateInGeorgia(new Date());
 const maxDate=dateInGeorgia(new Date(Date.now()+90*86400000));

 useEffect(()=>{
  const slug=new URLSearchParams(window.location.search).get('model');
  if(vehicles.some(v=>v.slug===slug))setModel(slug!);
 },[]);

 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!ready||status==='sending')return;
  setPhoneTouched(true);
  if(fullName.trim().length<2||!validPhone(phone)){
   setError('შეამოწმე სახელი და ქართული მობილურის ნომერი.');setStatus('error');return;
  }
  if(!consent){
   setError('მოთხოვნის გასაგზავნად საჭიროა მონაცემთა დამუშავების პირობების დადასტურება.');
   setStatus('error');return;
  }
  setStatus('sending');setError('');
  try{
   const url=new URL(window.location.href);
   const response=await fetch('/api/test-drive',{
    method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',
    body:JSON.stringify({
     model,fullName:fullName.trim(),phone:normalizePhone(phone),preferredDate,
     consent,marketingOptIn,honeypot,
     utmSource:url.searchParams.get('utm_source')||'',
     utmMedium:url.searchParams.get('utm_medium')||'',
     utmCampaign:url.searchParams.get('utm_campaign')||'',
     utmContent:url.searchParams.get('utm_content')||'',
     referrer:document.referrer
    })
   });
   const result=await response.json() as {id?:string;accepted?:boolean;error?:string};
   if(response.status!==201||!result.accepted)throw Error(result.error||'UNAVAILABLE');
   setReference(result.id||'');setStatus('success');
   // Never send customer PII, reference IDs or phone numbers into analytics.
   const w=window as Window&{dataLayer?:Record<string,unknown>[];
    gtag?:(...args:unknown[])=>void};
   if(w.dataLayer)w.dataLayer.push({event:'generate_lead',lead_type:'test_drive',model_slug:model});
   else w.gtag?.('event','generate_lead',{lead_type:'test_drive',model_slug:model});
  }catch(e){
   const code=e instanceof Error?e.message:'UNAVAILABLE';
   setError(code==='RATE_LIMIT'?'მოთხოვნების ლიმიტი ამოიწურა. გთხოვ, მოგვიანებით სცადო.':
    code==='INVALID'?'შეამოწმე შეყვანილი მონაცემები და სცადე თავიდან.':
    code==='NOT_ACTIVE'?'ონლაინ განაცხადების მიღება ამჟამად მიუწვდომელია.':
    'მოთხოვნის გაგზავნა ვერ მოხერხდა. გთხოვ, სცადო ხელახლა ან დაგვიკავშირდე.');
   setStatus('error');
  }
 }
 function reset(){
  setFullName('');setPhone('');setPhoneTouched(false);setDate('');
  setConsent(false);setMarketingOptIn(false);setHoneypot('');
  setStatus('idle');setError('');setReference('');
 }
 return <section className="jmc-lead-flow" id="test-drive-request" aria-labelledby="jmc-lead-title">
  <div className="jmc-lead-flow-head">
   <div>
    <p className="eyebrow">Test Drive / მოთხოვნის ფორმა</p>
    <h2 id="jmc-lead-title">აირჩიე შენი JMC</h2>
    <p>სამი მოდელი, ერთი მარტივი პროცესი. შეარჩიე ავტომობილი და ჩვენი გუნდი დაგეხმარება საცდელი მართვის დროის შეთანხმებაში.</p>
   </div>
   <span className={'jmc-lead-availability'+(ready?' is-ready':'')} role="status">
    <span aria-hidden="true" className="jmc-lead-availability-dot"/>
    {ready?'ონლაინ განაცხადები აქტიურია':'ონლაინ განაცხადები ჯერ არ მიიღება'}
   </span>
  </div>
  {status==='success'?<div className="jmc-lead-success" role="status">
   <div className="jmc-lead-success-symbol" aria-hidden="true"><JmcIcon name="check"/></div>
   <p className="eyebrow">Test Drive / მოთხოვნა მიღებულია</p>
   <h3>შენი მოთხოვნა მიღებულია</h3>
   <p>არჩეული მოდელი: <strong>{selected.name}</strong>. ჩვენი წარმომადგენელი დაგიკავშირდება თავისუფალი დროისა და დეტალების შესათანხმებლად. ეს არ არის ავტომატურად დადასტურებული დაჯავშნა.</p>
   {reference&&<p className="jmc-lead-reference">განაცხადის ნომერი: {reference}</p>}
   <div className="jmc-lead-success-actions">
    <button type="button" className="button" onClick={reset}>ახალი მოთხოვნის გაგზავნა <JmcIcon name="arrow-up-right"/></button>
    <Link href="/vehicles" className="jmc-td-text-link">მოდელების გაცნობა <JmcIcon name="arrow-up-right"/></Link>
   </div>
  </div>:<form className="jmc-lead-form" onSubmit={submit} aria-busy={status==='sending'}>
   <fieldset className="jmc-lead-models">
    <legend><span>01</span> აირჩიე ავტომობილი</legend>
    <div className="jmc-lead-model-grid">
     {vehicles.map(v=><label key={v.slug}
      className={'jmc-lead-model'+(model===v.slug?' is-selected':'')}>
      <input type="radio" name="model" value={v.slug} checked={model===v.slug}
       onChange={()=>{setModel(v.slug);setError('')}}/>
      <span className="jmc-lead-model-photo">
       <img src={studioImageFor(v.slug,v.heroImage)} loading="lazy" alt=""/>
      </span>
      <span className="jmc-lead-model-name">{v.name}</span>
      <span className="jmc-lead-model-choice" aria-hidden="true">{model===v.slug?'არჩეულია':'აირჩიე'} <JmcIcon name="arrow-up-right"/></span>
     </label>)}
    </div>
    <p className="jmc-lead-model-assist">გჭირდება დამატებითი ინფორმაცია? <Link href={`/vehicles/${model}`}>გაიცანი {selected.name} <JmcIcon name="arrow-up-right"/></Link></p>
   </fieldset>
   <fieldset className="jmc-lead-details" disabled={!ready||status==='sending'}>
    <legend><span>02</span> შენი საკონტაქტო ინფორმაცია</legend>
    <div className="jmc-lead-fields">
     <label>სახელი და გვარი <span className="jmc-lead-required">*</span>
      <input required autoComplete="name" maxLength={100} minLength={2}
       placeholder="შეიყვანე სახელი და გვარი" value={fullName}
       onChange={e=>{setFullName(e.target.value);setError('')}}/>
     </label>
     <label>მობილურის ნომერი <span className="jmc-lead-required">*</span>
      <input required autoComplete="tel" type="tel" inputMode="tel"
       placeholder="+995 5XX XX XX XX" maxLength={24} aria-describedby="jmc-lead-phone-help"
       aria-invalid={phoneTouched&&phone.length>0&&!validPhone(phone)}
       value={phone} onBlur={()=>setPhoneTouched(true)}
       onChange={e=>{setPhone(e.target.value);setError('')}}/>
      <span id="jmc-lead-phone-help" className={'jmc-lead-field-help'+
       (phoneTouched&&phone.length>0&&!validPhone(phone)?' is-invalid':'')}>
       {phoneTouched&&phone.length>0&&!validPhone(phone)?
        'შეიყვანე ქართული მობილური: 5XX XX XX XX':'დაგიკავშირდებით მხოლოდ მოთხოვნის დასაზუსტებლად.'}
      </span>
     </label>
     <label>სასურველი დღე <small>(არასავალდებულო)</small>
      <input type="date" min={today} max={maxDate} value={preferredDate}
       onChange={e=>setDate(e.target.value)}/>
      <span className="jmc-lead-field-help">თარიღს საბოლოოდ ჩვენი წარმომადგენელი შეგითანხმებს.</span>
     </label>
    </div>
   </fieldset>
   <div className="jmc-lead-consent">
    <label>
     <input type="checkbox" required disabled={!ready||status==='sending'}
      checked={consent} onChange={e=>setConsent(e.target.checked)}/>
     <span>ვეთანხმები საკონტაქტო მონაცემების დამუშავებას ტესტ-დრაივის მოთხოვნასთან დასაკავშირებლად.
      <Link href="/privacy"> კონფიდენციალურობის პირობები</Link> <span className="jmc-lead-required">*</span></span>
    </label>
    <label>
     <input type="checkbox" disabled={!ready||status==='sending'}
      checked={marketingOptIn} onChange={e=>setMarketingOptIn(e.target.checked)}/>
     <span>მსურს მივიღო JMC-ის სიახლეები და შეთავაზებები (არასავალდებულო).</span>
    </label>
   </div>
   <div className="jmc-lead-trap" aria-hidden="true">
    <label>არ შეავსო<input tabIndex={-1} autoComplete="off"
     value={honeypot} onChange={e=>setHoneypot(e.target.value)}/></label>
   </div>
   {!ready&&<div className="jmc-lead-hold" role="status">
    <strong>ონლაინ გაგზავნა მალე გახდება ხელმისაწვდომი.</strong>
    <p>ფორმა მზადაა, მაგრამ მოთხოვნების მიღებამდე მონაცემთა დაცვის პირობების დამტკიცება მიმდინარეობს. მანამდე შეგიძლია ნახო შოურუმის მისამართი და გაეცნო ჩვენს მოდელებს.</p>
    <Link href="/contact" className="button">შოურუმის მისამართი <JmcIcon name="arrow-up-right"/></Link>
   </div>}
   {error&&<p className="jmc-lead-error" role="alert">{error}</p>}
   <div className="jmc-lead-submit">
    <button className="button" type="submit" disabled={!ready||status==='sending'}>
     {status==='sending'?'მოთხოვნა იგზავნება…':'გაგზავნე Test Drive მოთხოვნა'}
     <JmcIcon name="arrow-up-right"/>
    </button>
    <small>სასურველი დრო საბოლოოდ შეთანხმდება გაყიდვების წარმომადგენელთან.</small>
   </div>
  </form>}
 </section>;
}
