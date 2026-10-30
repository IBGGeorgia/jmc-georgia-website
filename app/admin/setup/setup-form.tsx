'use client';
import {useEffect,useState} from 'react';
export function CMSSetup(){
 const [enabled,setEnabled]=useState<boolean|null>(null);
 const [setupToken,setSetupToken]=useState('');
 const [username,setUsername]=useState('');
 const [displayName,setDisplayName]=useState('');
 const [password,setPassword]=useState('');
 const [confirm,setConfirm]=useState('');
 const [saving,setSaving]=useState(false);
 const [done,setDone]=useState(false);
 const [message,setMessage]=useState('');
 useEffect(()=>{
  void fetch('/api/admin/setup',{cache:'no-store'}).then(async r=>{
   const v=await r.json() as {setupAvailable:boolean};
   setEnabled(Boolean(v.setupAvailable));
  }).catch(()=>setEnabled(false));
 },[]);
 async function submit(event:React.FormEvent){
  event.preventDefault();if(saving||!enabled)return;
  // The submit button must remain clickable; silently disabling it hid
  // whether password length or the confirmation was the blocker.
  if(setupToken.length<43||setupToken.length>512){
   setMessage('Setup გასაღები უნდა შეიცავდეს მინიმუმ 43 სიმბოლოს.');return;
  }
  if(!/^[a-z][a-z0-9._-]{2,63}$/.test(username)){
   setMessage('მომხმარებლის სახელი: 3–64 სიმბოლო, დაიწყე ლათინური ასოთი.');return;
  }
  if(displayName.trim().length<2||displayName.trim().length>120){
   setMessage('შეიყვანე ადმინისტრატორის სახელი (2–120 სიმბოლო).');return;
  }
  if(password.length<16||password.length>256){
   setMessage('პაროლი უნდა შეიცავდეს მინიმუმ 16 სიმბოლოს. ამჟამად: '+password.length+'.');return;
  }
  if(password!==confirm){setMessage('პაროლები ერთმანეთს არ ემთხვევა. გადაამოწმე ორივე ველი.');return}
  setSaving(true);setMessage('');
  try{
   const response=await fetch('/api/admin/setup',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({setupToken,username,displayName,password})
   });
   const result=await response.json() as {error?:string;ok?:boolean};
   if(!response.ok){
    const errors:Record<string,string>={
     INVALID_SETUP_TOKEN:'ერთჯერადი გასაღები არასწორია.',
     ALREADY_INITIALIZED:'CMS უკვე გააქტიურებულია. გამოიყენე არსებული ანგარიში.',
     DATABASE_UNAVAILABLE:'მონაცემთა ბაზასთან კავშირი ვერ დამყარდა.',
     SETUP_FAILED:'ინიციალიზაცია ვერ დასრულდა. გადაამოწმე ბაზის კავშირი.',
     NOT_READY:'ჯერ საჭირო საიდუმლო პარამეტრები არ არის კონფიგურირებული.'
    };
    throw Error(errors[result.error||'']||'შეამოწმე მონაცემები და სცადე თავიდან.');
   }
   setPassword('');setConfirm('');setSetupToken('');
   setDone(true);
  }catch(e){setMessage(e instanceof Error?e.message:'დაკავშირება ვერ მოხერხდა.')}
  finally{setSaving(false)}
 }
 if(enabled===null)return <section className="jmc-cms-setup-card" role="status"><p>მზადყოფნა მოწმდება…</p></section>;
 if(!enabled)return <section className="jmc-cms-setup-card" role="status">
  <h2>უსაფრთხო დაყენება ჯერ არ არის გააქტიურებული</h2>
  <p>Render-ში `DATABASE_URL` უნდა უკავშირდებოდეს PostgreSQL-ის Internal URL-ს, ხოლო `CMS_SETUP_ENABLED` — `true`-ს და `CMS_SETUP_TOKEN` — ძლიერი, შემთხვევითი გასაღებით უნდა შეივსოს.</p>
  <p>ეს გასაღები და მონაცემთა ბაზის მისამართი არავის გადაუგზავნო ჩატში.</p>
 </section>;
 if(done)return <section className="jmc-cms-setup-card" role="status">
  <h2>CMS ინიციალიზაცია დასრულებულია</h2>
  <p>პირველი ადმინისტრატორის ანგარიში შეიქმნა. ახლა შეგიძლია სისტემაში შეხვიდე.</p>
  <a className="button" href="/admin">ავტორიზაციის გვერდზე გადასვლა ↗</a>
  <p>უსაფრთხოების მიზნით Render-ში გამორთე `CMS_SETUP_ENABLED` და წაშალე `CMS_SETUP_TOKEN`.</p>
 </section>;
 return <section className="jmc-cms-setup-card">
  <h2>CMS-ის ერთჯერადი გააქტიურება</h2>
  <p>ეს ფორმა გამოიყენება მხოლოდ პირველი ადმინისტრატორის შესაქმნელად. უკვე შექმნილ CMS-ზე ხელახალი ინიციალიზაცია დაიბლოკება.</p>
  <form onSubmit={submit} noValidate className="jmc-cms-setup-fields">
   <label>Render-ის ერთჯერადი Setup გასაღები
    <input type="password" autoComplete="off" required minLength={43} maxLength={512}
     value={setupToken} onChange={e=>setSetupToken(e.target.value)}/>
   </label>
   <label>მომხმარებლის სახელი
    <input type="text" autoCapitalize="off" autoComplete="username"
     required minLength={3} maxLength={64} pattern="[a-z][a-z0-9._-]{2,63}"
     value={username} onChange={e=>setUsername(e.target.value.toLowerCase())}
     placeholder="მაგ. jmc.admin"/>
   </label>
   <label>ადმინისტრატორის სახელი
    <input type="text" autoComplete="name" required minLength={2} maxLength={120}
     value={displayName} onChange={e=>setDisplayName(e.target.value)}
     placeholder="სახელი და გვარი"/>
   </label>
   <label>პაროლი — მინიმუმ 16 სიმბოლო
    <input type="password" autoComplete="new-password" required minLength={16} maxLength={256}
     value={password} aria-describedby="cms-password-hint" aria-invalid={password.length>0&&password.length<16}
     onChange={e=>{setPassword(e.target.value);setMessage('')}}/>
    <span id="cms-password-hint" className={password.length>=16?'jmc-cms-validation is-valid':'jmc-cms-validation'} aria-live="polite">
     {password.length===0?'მინიმუმ 16 სიმბოლო':password.length<16?'კიდევ '+(16-password.length)+' სიმბოლოა საჭირო':'✓ პაროლის მინიმალური სიგრძე შესრულებულია'}
    </span>
   </label>
   <label>გაიმეორე პაროლი
    <input type="password" autoComplete="new-password" required minLength={16} maxLength={256}
     value={confirm} aria-describedby="cms-confirm-hint" aria-invalid={confirm.length>0&&password!==confirm}
     onChange={e=>{setConfirm(e.target.value);setMessage('')}}/>
    <span id="cms-confirm-hint" className={confirm.length>0&&password===confirm?'jmc-cms-validation is-valid':'jmc-cms-validation'} aria-live="polite">
     {confirm.length===0?'გაიმეორე ზუსტად იგივე პაროლი':password===confirm?'✓ პაროლები ემთხვევა':'პაროლები ერთმანეთს არ ემთხვევა'}
    </span>
   </label>
   {message&&<p className="jmc-cms-setup-error" role="alert">{message}</p>}
   <button className="button" type="submit" disabled={saving}>
    {saving?'მიმდინარეობს…':'CMS-ის გააქტიურება ↗'}
   </button>
  </form>
  <p className="jmc-cms-setup-note">მონაცემები იგზავნება მხოლოდ დაცული HTTPS კავშირით. პაროლი და Setup გასაღები ბრაუზერში არ ინახება.</p>
 </section>;
}
