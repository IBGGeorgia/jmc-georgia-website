'use client';
import {useState} from 'react';
type Lead={id:string;full_name:string;phone:string;model_slug:string;preferred_date:string|null;
 source:string|null;medium:string|null;campaign:string|null;status:string;notes:string;
 created_at:string;marketing_opt_in:boolean};
const statuses=[{value:'new',label:'ახალი'},{value:'contacted',label:'დაკავშირებული'},
 {value:'scheduled',label:'დაგეგმილი'},{value:'completed',label:'დასრულებული'},
 {value:'cancelled',label:'გაუქმებული'}];
export function AdminLogin(){
 const [password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 return <form className="jmc-manager-login" onSubmit={async e=>{
  e.preventDefault();setBusy(true);setError('');
  try{
   const r=await fetch('/api/lead-manager/auth',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({password})});
   if(!r.ok)throw Error('invalid');
   window.location.reload();
  }catch{setError('ავტორიზაცია ვერ მოხერხდა. გადაამოწმე პაროლი.');setBusy(false)}
 }}>
  <label>ადმინისტრატორის პაროლი<input type="password" autoComplete="current-password" minLength={1}
   required value={password} onChange={e=>setPassword(e.target.value)}/></label>
  {error&&<p role="alert">{error}</p>}
  <button className="button" disabled={busy}>{busy?'მოწმდება…':'შესვლა'}</button>
 </form>;
}
export function LeadManagerClient({leads}:{leads:Lead[]}){
 const [data,setData]=useState(leads);
 const [filter,setFilter]=useState('all');
 const [search,setSearch]=useState('');
 const [saving,setSaving]=useState('');
 const [notice,setNotice]=useState('');
 const [drafts,setDrafts]=useState<Record<string,{status:string;notes:string}>>({});
 const rows=data.filter(item=>(filter==='all'||item.status===filter)&&
  (item.full_name+' '+item.phone+' '+item.model_slug).toLowerCase().includes(search.toLowerCase()));
 async function save(item:Lead){
  setSaving(item.id);setNotice('');
  const draft=drafts[item.id]||{status:item.status,notes:item.notes||''};
  try{
   const r=await fetch('/api/lead-manager',{method:'PATCH',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:item.id,...draft})});
   if(!r.ok)throw Error('failed');
   setData(old=>old.map(x=>x.id===item.id?{...x,...draft}:x));
   setNotice('ცვლილება შენახულია.');
  }catch{setNotice('შენახვა ვერ მოხერხდა.')}
  finally{setSaving('')}
 }
 const count=(s:string)=>data.filter(x=>x.status===s).length;
 return <div className="jmc-manager">
  <div className="jmc-manager-tools">
   <div><h2>განაცხადები</h2><p>ბოლო 200 ჩანაწერი · განახლებები ინახება მონაცემთა ბაზაში</p></div>
   <div className="jmc-manager-actions">
    <a className="button" href="/api/lead-manager/export">CSV Export</a>
    <button className="button button-ghost" type="button" onClick={async()=>{
     await fetch('/api/lead-manager/auth',{method:'DELETE'});window.location.reload();
    }}>გამოსვლა</button>
   </div>
  </div>
  <div className="jmc-manager-kpis">
   {statuses.slice(0,4).map(s=><div key={s.value}><strong>{count(s.value)}</strong><span>{s.label}</span></div>)}
  </div>
  <div className="jmc-manager-filters">
   <label>ძებნა<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="სახელი, ნომერი ან მოდელი"/></label>
   <label>სტატუსი<select value={filter} onChange={e=>setFilter(e.target.value)}>
    <option value="all">ყველა</option>{statuses.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
   </select></label>
  </div>
  {notice&&<p role="status" className="jmc-manager-notice">{notice}</p>}
  <div className="jmc-manager-table" role="region" aria-label="Test Drive განაცხადები" tabIndex={0}>
   <table><thead><tr><th>მომხმარებელი</th><th>მოდელი / თარიღი</th><th>წყარო</th><th>სტატუსი</th><th>შენიშვნა</th><th>მოქმედება</th></tr></thead>
    <tbody>{rows.map(item=>{
     const draft=drafts[item.id]||{status:item.status,notes:item.notes||''};
     return <tr key={item.id}><td><strong>{item.full_name}</strong><span>{item.phone}</span><small>{new Date(item.created_at).toLocaleString('ka-GE')}</small></td>
      <td>{item.model_slug}<small>{item.preferred_date||'შესათანხმებელი'}</small></td>
      <td>{item.source||'პირდაპირი'}<small>{item.campaign||'—'}</small></td>
      <td><select aria-label={'სტატუსი: '+item.full_name} value={draft.status}
       onChange={e=>setDrafts(old=>({...old,[item.id], [item.id]:{...draft,status:e.target.value}}))}>
        {statuses.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></td>
      <td><textarea aria-label={'შენიშვნა: '+item.full_name} maxLength={1000} rows={2}
       value={draft.notes} onChange={e=>setDrafts(old=>({...old,[item.id]:{...draft,notes:e.target.value}}))}/></td>
      <td><button type="button" className="button" disabled={saving===item.id}
       onClick={()=>save(item)}>{saving===item.id?'ინახება…':'შენახვა'}</button></td>
     </tr>})}</tbody>
   </table>
   {rows.length===0&&<p>შესაბამისი განაცხადები არ მოიძებნა.</p>}
  </div>
 </div>;
}
