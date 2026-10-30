'use client';
import {useEffect,useState} from 'react';
type CMSRole='admin'|'sales'|'editor';
type Account={id:string;username:string;display_name:string;role:CMSRole;is_active:boolean;created_at:string;last_login_at:string|null};
const roles:{value:CMSRole;label:string}[]=[{value:'admin',label:'ადმინისტრატორი'},{value:'sales',label:'გაყიდვების გუნდი'},{value:'editor',label:'კონტენტის რედაქტორი'}];
const readable=(value:string|null)=>value?new Date(value).toLocaleString('ka-GE',{timeZone:'Asia/Tbilisi'}):'ჯერ არ შესულა';
function errorText(code?:string){
 const m:Record<string,string>={
  USERNAME_TAKEN:'ეს მომხმარებლის სახელი უკვე გამოყენებულია.',
  LAST_ADMIN:'ბოლო აქტიური ადმინისტრატორის გათიშვა ან როლის შეცვლა დაუშვებელია.',
  SELF_MODIFICATION_DENIED:'საკუთარი ანგარიშის ცვლილება ამ პანელიდან შეზღუდულია.',
  ORIGIN:'სესიის შემოწმება ვერ შესრულდა. განაახლე გვერდი.',
  INVALID:'შეამოწმე მონაცემები და პაროლი (მინიმუმ 16 სიმბოლო).',
  UNAVAILABLE:'მონაცემთა ბაზა მიუწვდომელია. გადაამოწმე კონფიგურაცია.'
 };
 return m[code||'']||'მოქმედება ვერ დასრულდა. სცადე თავიდან.';
}
export function CMSUsers({actorId}:{actorId:string}){
 const [users,setUsers]=useState<Account[]>([]);
 const [loading,setLoading]=useState(true);
 const [saving,setSaving]=useState('');
 const [notice,setNotice]=useState('');
 const [error,setError]=useState('');
 const [username,setUsername]=useState('');
 const [displayName,setDisplayName]=useState('');
 const [password,setPassword]=useState('');
 const [role,setRole]=useState<CMSRole>('sales');
 const [draftRole,setDraftRole]=useState<Record<string,CMSRole>>({});
 const [resetUser,setResetUser]=useState<string|null>(null);
 const [resetPassword,setResetPassword]=useState('');
 async function refresh(){
  try{
   const response=await fetch('/api/admin/users',{cache:'no-store'});
   if(!response.ok)throw Error('unavailable');
   const body=await response.json() as {users:Account[]};
   setUsers(body.users);
   setDraftRole(Object.fromEntries(body.users.map(user=>[user.id,user.role])));
   setError('');
  }catch{setError('მომხმარებლების სია ვერ ჩაიტვირთა. გადაამოწმე ბაზის კავშირი.')}
  finally{setLoading(false)}
 }
 useEffect(()=>{void refresh()},[]);
 async function callAPI(method:'POST'|'PATCH',body:Record<string,unknown>){
  const response=await fetch('/api/admin/users',{
   method,headers:{'Content-Type':'application/json'},body:JSON.stringify(body)
  });
  const data=await response.json() as {error?:string;ok?:boolean};
  if(!response.ok)throw Error(data.error||'UNAVAILABLE');
 }
 async function create(event:React.FormEvent){
  event.preventDefault();setSaving('create');setNotice('');setError('');
  try{
   await callAPI('POST',{username,displayName,password,role});
   setUsername('');setDisplayName('');setPassword('');setRole('sales');
   await refresh();setNotice('მომხმარებლის ანგარიში შეიქმნა. პაროლი გადაეცი თანამშრომელს მხოლოდ უსაფრთხო არხით.');
  }catch(e){setError(errorText(e instanceof Error?e.message:undefined))}
  finally{setSaving('')}
 }
 async function change(user:Account,action:'set_role'|'set_active'|'reset_password',value?:unknown){
  setSaving(user.id);setNotice('');setError('');
  try{
   await callAPI('PATCH',action==='set_role'?{id:user.id,action,role:value}:
    action==='set_active'?{id:user.id,action,active:value}:{id:user.id,action,password:value});
   setResetUser(null);setResetPassword('');
   await refresh();setNotice('ცვლილება შენახულია. მომხმარებლის წინა სესიები გაუქმებულია.');
  }catch(e){setError(errorText(e instanceof Error?e.message:undefined))}
  finally{setSaving('')}
 }
 return <div className="jmc-cms-users">
  <div className="jmc-cms-users-summary">
   <div><strong>{loading?'—':users.length}</strong><span>ანგარიში</span></div>
   <div><strong>{loading?'—':users.filter(u=>u.is_active).length}</strong><span>აქტიური</span></div>
   <div><strong>{loading?'—':users.filter(u=>u.role==='admin'&&u.is_active).length}</strong><span>ადმინისტრატორი</span></div>
  </div>
  <section className="jmc-cms-add-user" aria-labelledby="cms-add-user-title">
   <h2 id="cms-add-user-title">ახალი თანამშრომელი</h2>
   <p>თითოეულ ადამიანს საკუთარი ანგარიში აქვს. პაროლს არ ვინახავთ ღია ტექსტად და ელფოსტით არ ვაგზავნით.</p>
   <form onSubmit={create}>
    <label>მომხმარებლის სახელი
     <input autoComplete="off" value={username} onChange={e=>setUsername(e.target.value.toLowerCase())}
      pattern="[a-z][a-z0-9._-]{2,63}" minLength={3} maxLength={64} placeholder="მაგ. sales.manager" required/>
    </label>
    <label>სახელი და გვარი
     <input autoComplete="off" value={displayName} onChange={e=>setDisplayName(e.target.value)}
      minLength={2} maxLength={120} placeholder="თანამშრომლის სახელი" required/>
    </label>
    <label>წვდომის დონე
     <select value={role} onChange={e=>setRole(e.target.value as CMSRole)}>
      {roles.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
     </select>
    </label>
    <label>საწყისი პაროლი (მინ. 16 სიმბოლო)
     <input type="password" autoComplete="new-password" value={password} minLength={16} maxLength={256}
      onChange={e=>setPassword(e.target.value)} placeholder="უნიკალური, ძლიერი პაროლი" required/>
    </label>
    <button type="submit" className="button" disabled={Boolean(saving)}>
     {saving==='create'?'იქმნება…':'ანგარიშის შექმნა'}
    </button>
   </form>
  </section>
  {notice&&<p role="status" className="jmc-cms-users-notice">{notice}</p>}
  {error&&<p role="alert" className="jmc-cms-users-error">{error}</p>}
  <section className="jmc-cms-accounts" aria-labelledby="cms-users-title">
   <div className="jmc-cms-accounts-title"><h2 id="cms-users-title">მომხმარებლები</h2>
    <button type="button" className="button" onClick={()=>void refresh()} disabled={Boolean(saving)}>განახლება</button>
   </div>
   {loading?<p>იტვირთება…</p>:users.length===0?<p>მომხმარებლები ვერ მოიძებნა.</p>:
   <div className="jmc-cms-users-list">{users.map(user=>
    <article className="jmc-cms-user-item" key={user.id}>
     <div className="jmc-cms-user-info">
      <strong>{user.display_name}</strong><span>@{user.username}</span>
      <small>ბოლო შესვლა: {readable(user.last_login_at)}</small>
      <small>{user.is_active?'აქტიური ანგარიში':'შეჩერებული ანგარიში'}</small>
     </div>
     <div className="jmc-cms-user-controls">
      <label>როლი
       <select disabled={Boolean(saving)||user.id===actorId} value={draftRole[user.id]||user.role}
        onChange={e=>setDraftRole(prev=>({...prev,[user.id]:e.target.value as CMSRole}))}>
        {roles.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
       </select>
      </label>
      <button type="button" className="button" disabled={Boolean(saving)||user.id===actorId||(draftRole[user.id]||user.role)===user.role}
       onClick={()=>void change(user,'set_role',draftRole[user.id]||user.role)}>როლის შენახვა</button>
      <button type="button" className="button" disabled={Boolean(saving)||user.id===actorId}
       onClick={()=>void change(user,'set_active',!user.is_active)}>
        {user.is_active?'წვდომის შეჩერება':'გააქტიურება'}
      </button>
      <button type="button" className="button" disabled={Boolean(saving)||user.id===actorId}
       onClick={()=>{setResetUser(resetUser===user.id?null:user.id);setResetPassword('')}}>
       პაროლის შეცვლა
      </button>
     </div>
     {resetUser===user.id&&<form className="jmc-cms-reset" onSubmit={e=>{
      e.preventDefault();void change(user,'reset_password',resetPassword);
     }}>
      <label>ახალი პაროლი
       <input type="password" minLength={16} maxLength={256} autoComplete="new-password"
        required value={resetPassword} onChange={e=>setResetPassword(e.target.value)}/>
      </label>
      <button className="button" disabled={Boolean(saving)} type="submit">პაროლის შენახვა</button>
      <button className="button" type="button" onClick={()=>{setResetUser(null);setResetPassword('')}}>გაუქმება</button>
     </form>}
    </article>)}</div>}
  </section>
 </div>;
}
