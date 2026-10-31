'use client';
import {useEffect,useRef,useState} from 'react';
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
const displayPhone=(value:string)=>{
 const normalized=normalizePhone(value);
 if(!validPhone(value))return value;
 return normalized.slice(0,4)+' '+normalized.slice(4,7)+' '+normalized.slice(7,9)+
  ' '+normalized.slice(9,11)+' '+normalized.slice(11,13);
};
/** Analytics payloads contain only event names, selected model and validation field codes. */
function track(event:string,fields:Record<string,string>={}){
 const w=window as Window&{dataLayer?:Record<string,unknown>[];
  gtag?:(...args:unknown[])=>void};
 const payload={event,lead_type:'test_drive',...fields};
 if(w.dataLayer)w.dataLayer.push(payload);
 else w.gtag?.('event',event,{lead_type:'test_drive',...fields});
}

export function TestDriveForm({ready}:{ready:boolean}){
 const [model,setModel]=useState('vigus');
 const [view,setView]=useState(0);
 const [fullName,setFullName]=useState('');
 const [nameTouched,setNameTouched]=useState(false);
 const [phone,setPhone]=useState('');
 const [phoneTouched,setPhoneTouched]=useState(false);
 const [preferredDate,setDate]=useState('');
 const [consent,setConsent]=useState(false);
 const [marketingOptIn,setMarketingOptIn]=useState(false);
 const [honeypot,setHoneypot]=useState('');
 const [status,setStatus]=useState<Status>('idle');
 const [error,setError]=useState('');
 const [reference,setReference]=useState('');
 const started=useRef(false);
 const selected=vehicles.find(v=>v.slug===model)??vehicles[0];
 // VIGUS uses two FLUX.2 Pro background-edit candidates, imported as local PNGs.
 // The original black-background product angles stay retained elsewhere in the catalogue.
 // Other models retain their source-backed galleries.
 const verifiedVigusScenes=['/images/vigus/drive-front-20261030.png','/images/vigus/drive-side-20261030.png'];
 const views=[
  {label:'Studio',src:studioImageFor(selected.slug,selected.heroImage),scene:false},
  ...(selected.slug==='vigus'?verifiedVigusScenes:selected.gallery.slice(0,2))
   .map((src,i)=>({label:'რაკურსი '+(i+2),src,scene:selected.slug==='vigus'}))
 ].filter(item=>Boolean(item.src));
 const selectedView=views[Math.min(view,views.length-1)]||views[0];
 const today=dateInGeorgia(new Date());
 const maxDate=dateInGeorgia(new Date(Date.now()+90*86400000));
 const invalidName=nameTouched&&fullName.trim().length<2;
 const invalidPhone=phoneTouched&&!validPhone(phone);

 useEffect(()=>{
  const slug=new URLSearchParams(window.location.search).get('model');
  if(vehicles.some(v=>v.slug===slug))setModel(slug!);
 },[]);

 function selectModel(slug:string){
  if(model===slug)return;
  setModel(slug);setView(0);setError('');
  track('model_select',{model_slug:slug});
 }
 function formStart(){
  if(!ready||started.current)return;
  started.current=true;
  track('form_start',{model_slug:model});
 }
 function validationError(field:'full_name'|'phone'|'consent'){
  track('validation_error',{field,model_slug:model});
 }
 async function submit(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(!ready||status==='sending')return;
  setNameTouched(true);setPhoneTouched(true);
  if(fullName.trim().length<2){
   setError('გთხოვ, მიუთითო სახელი და გვარი.');
   setStatus('error');validationError('full_name');return;
  }
  if(!validPhone(phone)){
   setError('გთხოვ, შეამოწმო მობილურის ნომერი.');
   setStatus('error');validationError('phone');return;
  }
  if(!consent){
   setError('მოთხოვნის გასაგზავნად საჭიროა მონაცემთა დამუშავების პირობების დადასტურება.');
   setStatus('error');validationError('consent');return;
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
   track('generate_lead',{model_slug:model});
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
  setFullName('');setNameTouched(false);setPhone('');setPhoneTouched(false);
  setDate('');setConsent(false);setMarketingOptIn(false);setHoneypot('');
  setStatus('idle');setError('');setReference('');started.current=false;setView(0);
 }
 return <section className="jmc-lead-flow" id="test-drive-request" aria-labelledby="jmc-lead-title">
  <div className="jmc-lead-flow-head">
   <div>
    <p className="eyebrow">JMC / Drive Studio</p>
    <h2 id="jmc-lead-title">აირჩიე. გამოსცადე.</h2>
    <p>შეარჩიე სასურველი ავტომობილი და დაგვიტოვე საკონტაქტო ინფორმაცია — დანარჩენს ჩვენი გუნდი შეგითანხმებს.</p>
   </div>
   <span className={'jmc-lead-availability'+(ready?' is-ready':'')} role="status">
    <span aria-hidden="true" className="jmc-lead-availability-dot"/>
    {ready?'ონლაინ განაცხადები აქტიურია':'ონლაინ განაცხადები ჯერ არ მიიღება'}
   </span>
  </div>
  {status==='success'?
   <div className="jmc-drive-success-grid">
    <div className="jmc-drive-success-photo">
     <img src={studioImageFor(selected.slug,selected.heroImage)} alt={'JMC '+selected.name}/>
     <span>JMC / {selected.name}</span>
    </div>
    <div className="jmc-lead-success" role="status">
     <div className="jmc-lead-success-symbol" aria-hidden="true"><JmcIcon name="check"/></div>
     <p className="eyebrow">Test Drive / მოთხოვნა მიღებულია</p>
     <h3>შენი მოთხოვნა მიღებულია</h3>
     <p>შერჩეული ავტომობილი: <strong>{selected.name}</strong>. ჩვენი წარმომადგენელი დაგიკავშირდება დეტალებისა და დროის შესათანხმებლად.</p>
     <p>გთხოვ, გაითვალისწინო: განაცხადი ჯერ არ ნიშნავს ტესტ-დრაივის დროის დადასტურებას.</p>
     {reference&&<p className="jmc-lead-reference">განაცხადის ნომერი: {reference}</p>}
     <div className="jmc-lead-success-actions">
      <button type="button" className="button" onClick={reset}>ახალი მოთხოვნის გაგზავნა <JmcIcon name="arrow-up-right"/></button>
      <Link href="/vehicles" className="jmc-td-text-link">მოდელების გაცნობა <JmcIcon name="arrow-up-right"/></Link>
     </div>
    </div>
   </div>:
   <form className="jmc-lead-form" onSubmit={submit} aria-busy={status==='sending'} noValidate>
    <div className="jmc-drive-studio-layout">
     <div className="jmc-drive-stage">
      <div className="jmc-drive-stage-heading">
       <p className="jmc-drive-stage-index">01 / ავტომობილი</p>
       <h3>{selected.name}</h3>
       <p>გაეცანი ავტომობილს სხვადასხვა რაკურსიდან.</p>
      </div>
      <div className="jmc-drive-stage-media">
       <img className={'jmc-drive-stage-image'+(selectedView.scene?' is-photo-scene':'')}
        src={selectedView.src} data-selected-model={selected.slug} data-view={view}
        alt={'JMC '+selected.name+' — '+selectedView.label}/>
       {!selectedView.scene&&<span className="jmc-drive-stage-watermark" aria-hidden="true">JMC</span>}
      </div>
      <div className="jmc-drive-view-controls" role="group" aria-label="ავტომობილის რაკურსები">
       {views.map((item,i)=><button key={item.label} type="button"
        className={'jmc-drive-view'+(view===i?' is-active':'')}
        aria-pressed={view===i} onClick={()=>setView(i)}>
        <span>{i===0?'01':i===1?'02':'03'}</span>{item.label}
       </button>)}
      </div>
      <fieldset className="jmc-lead-models">
       <legend><span>01</span> აირჩიე ავტომობილი</legend>
       <div className="jmc-lead-model-grid">
        {vehicles.map(v=><label key={v.slug}
         className={'jmc-lead-model'+(model===v.slug?' is-selected':'')}>
         <input type="radio" name="model" value={v.slug} checked={model===v.slug}
          onChange={()=>selectModel(v.slug)}/>
         <span className="jmc-lead-model-photo">
          <img src={studioImageFor(v.slug,v.heroImage)} loading="lazy" alt=""/>
         </span>
         <span className="jmc-lead-model-name">{v.name}</span>
         <span className="jmc-lead-model-choice" aria-hidden="true">{model===v.slug?'არჩეულია':'აირჩიე'}</span>
        </label>)}
       </div>
       <p className="jmc-lead-model-assist">გჭირდება დამატებითი ინფორმაცია? <Link href={'/vehicles/'+model}>გაიცანი {selected.name} <JmcIcon name="arrow-up-right"/></Link></p>
      </fieldset>
     </div>
     <div className="jmc-drive-form-panel">
      <p className="jmc-drive-form-index">02 / საკონტაქტო ინფორმაცია</p>
      <h3>მოითხოვე Test Drive</h3>
      <p className="jmc-drive-form-intro">შეავსე მოკლე ფორმა. ჩვენი წარმომადგენელი დაგიკავშირდება საცდელი მართვის დროის შესათანხმებლად.</p>
      <div className="jmc-drive-selected-summary" aria-live="polite">
       <JmcIcon name="car-front" size={18}/> არჩეულია: <strong>{selected.name}</strong>
      </div>
      <fieldset className="jmc-lead-details" disabled={!ready||status==='sending'}>
       <legend><span>02</span> შენი საკონტაქტო ინფორმაცია</legend>
       <div className="jmc-lead-fields" onFocusCapture={formStart}>
        <label>სახელი და გვარი <span className="jmc-lead-required">*</span>
         <input required autoComplete="name" maxLength={100} minLength={2}
          placeholder="შეიყვანე სახელი და გვარი" value={fullName}
          aria-invalid={invalidName} aria-describedby="jmc-lead-name-help"
          onBlur={()=>setNameTouched(true)}
          onChange={e=>{setFullName(e.target.value);setError('')}}/>
         <span id="jmc-lead-name-help" className={'jmc-lead-field-help'+(invalidName?' is-invalid':'')}>
          {invalidName?'მიუთითე სულ მცირე ორი სიმბოლო.':'როგორც გირჩევნია, რომ მოგმართოთ.'}
         </span>
        </label>
        <label>მობილურის ნომერი <span className="jmc-lead-required">*</span>
         <input required autoComplete="tel" type="tel" inputMode="tel"
          placeholder="+995 5XX XX XX XX" maxLength={24} aria-describedby="jmc-lead-phone-help"
          aria-invalid={invalidPhone} value={phone}
          onBlur={()=>{setPhoneTouched(true);setPhone(displayPhone(phone))}}
          onChange={e=>{setPhone(e.target.value);setError('')}}/>
         <span id="jmc-lead-phone-help" className={'jmc-lead-field-help'+(invalidPhone?' is-invalid':'')}>
          {invalidPhone?'შეიყვანე ქართული მობილური: 5XX XX XX XX':'დაგიკავშირდებით მხოლოდ მოთხოვნის დასაზუსტებლად.'}
         </span>
        </label>
        <label>სასურველი დღე <small>(არასავალდებულო)</small>
         <input type="date" min={today} max={maxDate} value={preferredDate}
          onChange={e=>setDate(e.target.value)}/>
         <span className="jmc-lead-field-help">დრო საბოლოოდ შეთანხმდება ჩვენს წარმომადგენელთან.</span>
        </label>
       </div>
      </fieldset>
      <div className="jmc-lead-consent">
       <label>
        <input type="checkbox" required disabled={!ready||status==='sending'}
         checked={consent} onChange={e=>{setConsent(e.target.checked);setError('')}}/>
        <span>ვეთანხმები მონაცემების დამუშავებას Test Drive-ის მოთხოვნისთვის.
         <Link href="/privacy"> კონფიდენციალურობის პირობები</Link> <span className="jmc-lead-required">*</span></span>
       </label>
       <label>
        <input type="checkbox" disabled={!ready||status==='sending'}
         checked={marketingOptIn} onChange={e=>setMarketingOptIn(e.target.checked)}/>
        <span>მსურს მივიღო JMC-ის სიახლეები და შეთავაზებები (არასავალდებულო).
         თანხმობის გამოხმობა ნებისმიერ დროს შეგიძლია:
         <a href="mailto:compliance@ibg.ge"> compliance@ibg.ge</a>.</span>
       </label>
      </div>
      <div className="jmc-lead-trap" aria-hidden="true">
       <label>არ შეავსო<input tabIndex={-1} autoComplete="off"
        value={honeypot} onChange={e=>setHoneypot(e.target.value)}/></label>
      </div>
      {!ready&&<div className="jmc-lead-hold" role="status">
       <strong>ონლაინ გაგზავნა მალე გახდება ხელმისაწვდომი.</strong>
       <p>განაცხადების მიღება დროებით შეჩერებულია. შეგიძლია გაეცნო ჩვენს ავტომობილებს ან დაგვიკავშირდე.</p>
       <Link href="/contact" className="button">შოურუმის მისამართი <JmcIcon name="arrow-up-right"/></Link>
      </div>}
      {error&&<p className="jmc-lead-error" role="alert">{error}</p>}
      <div className="jmc-lead-submit">
       <button className="button" type="submit" disabled={!ready||status==='sending'}>
        {status==='sending'?'მოთხოვნა იგზავნება…':'გაგზავნე Test Drive მოთხოვნა'}
        <JmcIcon name="arrow-up-right"/>
       </button>
       <small>მოთხოვნა არ ნიშნავს დროის ავტომატურ დადასტურებას.</small>
      </div>
     </div>
    </div>
   </form>}
 </section>;
}
