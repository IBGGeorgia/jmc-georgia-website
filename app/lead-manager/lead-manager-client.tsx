'use client';
import {useEffect,useMemo,useState} from 'react';
type Status='new'|'contacted'|'scheduled'|'completed'|'cancelled';
type Lead={id:string;full_name:string;phone:string;model_slug:string;preferred_date:string|null;
 source:string|null;medium:string|null;campaign:string|null;status:Status;notes:string;
 created_at:string;updated_at:string;marketing_opt_in:boolean};
type Stats={total:number;new:number;contacted:number;scheduled:number;completed:number;cancelled:number;today:number};
type LeadResponse={leads:Lead[];page:number;limit:number;total:number;stats:Stats};
const statuses:{value:Status;label:string}[]=[
 {value:'new',label:'ახალი'},{value:'contacted',label:'დაკავშირებული'},
 {value:'scheduled',label:'დაგეგმილი'},{value:'completed',label:'დასრულებული'},
 {value:'cancelled',label:'გაუქმებული'}
];
const models=[{value:'all',label:'ყველა მოდელი'},{value:'vigus',label:'VIGUS'},
 {value:'grand-avenue',label:'Grand Avenue'},{value:'grand-avenue-pro',label:'Grand Avenue PRO'}];
const zero:Stats={total:0,new:0,contacted:0,scheduled:0,completed:0,cancelled:0,today:0};
const dates=(s:string)=>new Date(s).toLocaleString('ka-GE',{timeZone:'Asia/Tbilisi',day:'2-digit',
 month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
export function AdminLogin(){
 const [username,setUsername]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 return <form className="jmc-manager-login" onSubmit={async e=>{
  e.preventDefault();setBusy(true);setError('');
  try{
   const r=await fetch('/api/lead-manager/auth',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})});
   if(!r.ok)throw Error('invalid');
   window.location.assign('/admin');
  }catch{setError('ავტორიზაცია ვერ მოხერხდა. გადაამოწმე მომხმარებლის სახელი და პაროლი.');setBusy(false)}
 }}>
  <label>მომხმარებლის სახელი<input type="text" autoComplete="username" required minLength={3} maxLength={64}
   value={username} onChange={e=>setUsername(e.target.value)}/></label>
  <label>პაროლი<input type="password" autoComplete="current-password" minLength={1}
   required value={password} onChange={e=>setPassword(e.target.value)}/></label>
  {error&&<p role="alert">{error}</p>}
  <button className="button" disabled={busy}>{busy?'მოწმდება…':'შესვლა'}</button>
 </form>;
}
export function LeadManagerClient({role}:{role:'admin'|'sales'}){
 const [data,setData]=useState<Lead[]>([]);
 const [stats,setStats]=useState<Stats>(zero);
 const [statusFilter,setStatusFilter]=useState('all');
 const [modelFilter,setModelFilter]=useState('all');
 const [days,setDays]=useState('all');
 const [search,setSearch]=useState('');
 const [debounced,setDebounced]=useState('');
 const [page,setPage]=useState(1);
 const [total,setTotal]=useState(0);
 const [loading,setLoading]=useState(true);
 const [refresh,setRefresh]=useState(0);
 const [lastFetched,setLastFetched]=useState<Date|null>(null);
 const [saving,setSaving]=useState('');
 const [notice,setNotice]=useState('');
 const [error,setError]=useState('');
 const [drafts,setDrafts]=useState<Record<string,{status:Status;notes:string}>>({});
 useEffect(()=>{
  const handle=setTimeout(()=>setDebounced(search.trim().slice(0,100)),350);
  return ()=>clearTimeout(handle);
 },[search]);
 useEffect(()=>{
  const controller=new AbortController();
  const params=new URLSearchParams({status:statusFilter,model:modelFilter,days,q:debounced,page:String(page)});
  const load=async()=>{
   setLoading(true);setError('');
   try{
    const response=await fetch('/api/lead-manager?'+params.toString(),{
     cache:'no-store',signal:controller.signal,headers:{'Accept':'application/json'}
    });
    if(response.status===401){window.location.assign('/admin');return}
    if(!response.ok)throw Error('UNAVAILABLE');
    const result=await response.json() as LeadResponse;
    if(controller.signal.aborted)return;
    setData(result.leads);setStats(result.stats);setTotal(result.total);
    setLastFetched(new Date());
   }catch(e){
    if(controller.signal.aborted)return;
    setError('ლიდების განახლება ვერ მოხერხდა. სცადე ხელახლა.');
   }finally{if(!controller.signal.aborted)setLoading(false)}
  };
  void load();
  return ()=>controller.abort();
 },[statusFilter,modelFilter,days,debounced,page,refresh]);
 function changeFilter<T extends string>(setter:(x:T)=>void,value:T){
  setter(value);setPage(1);setNotice('');
 }
 function draft(item:Lead){return drafts[item.id]??{status:item.status,notes:item.notes||''}}
 async function save(item:Lead){
  if(saving)return;
  const current=draft(item);
  setSaving(item.id);setNotice('');setError('');
  try{
   const result=await fetch('/api/lead-manager',{
    method:'PATCH',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({id:item.id,...current})
   });
   if(result.status===401){window.location.assign('/admin');return}
   if(!result.ok)throw Error('UPDATE');
   setDrafts(old=>{const next={...old};delete next[item.id];return next});
   setNotice('განაცხადი შენახულია. ცვლილება აღირიცხა CMS-ის ისტორიაში.');
   setRefresh(v=>v+1);
  }catch{setError('შენახვა ვერ მოხერხდა. სცადე თავიდან.')}
  finally{setSaving('')}
 }
 const totalPages=Math.max(1,Math.ceil(total/25));
 const numbers=useMemo(()=>[
  {label:'ყველა ლიდი',value:stats.total},
  {label:'ახალი',value:stats.new},
  {label:'დაკავშირებული',value:stats.contacted},
  {label:'დაგეგმილი',value:stats.scheduled},
  {label:'დღეს შემოსული',value:stats.today}
 ],[stats]);
 return <div className="jmc-manager jmc-lead-inbox-v2">
  <div className="jmc-manager-tools">
   <div><h2>განაცხადები</h2><p>ყველა მოთხოვნა PostgreSQL-იდან · ინდივიდუალური უფლებებით დაცული</p></div>
   <div className="jmc-manager-actions">
    <button className="button" type="button" onClick={()=>setRefresh(v=>v+1)} disabled={loading||Boolean(saving)}>
     {loading?'მოწმდება…':'განახლება ↻'}
    </button>
    {role==='admin'&&<a className="button" href="/api/lead-manager/export">CSV ექსპორტი ↗</a>}
   </div>
  </div>
  <div className="jmc-manager-kpis jmc-lead-kpis">
   {numbers.map(item=><div key={item.label}><strong>{loading&&!lastFetched?'—':item.value}</strong><span>{item.label}</span></div>)}
  </div>
  <div className="jmc-lead-filter-panel">
   <div className="jmc-manager-filters">
    <label>ძებნა<input value={search} maxLength={100}
     onChange={e=>{setSearch(e.target.value);setPage(1)}}
     placeholder="სახელი, ტელეფონი ან მოდელი"/></label>
    <label>სტატუსი<select value={statusFilter} onChange={e=>changeFilter(setStatusFilter,e.target.value)}>
     <option value="all">ყველა სტატუსი</option>
     {statuses.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
    </select></label>
    <label>მოდელი<select value={modelFilter} onChange={e=>changeFilter(setModelFilter,e.target.value)}>
     {models.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}
    </select></label>
    <label>პერიოდი<select value={days} onChange={e=>changeFilter(setDays,e.target.value)}>
     <option value="all">ყველა თარიღი</option><option value="1">ბოლო 24 საათი</option>
     <option value="7">ბოლო 7 დღე</option><option value="30">ბოლო 30 დღე</option>
    </select></label>
   </div>
   <div className="jmc-lead-toolbar">
    <span role="status">{loading?'იტვირთება…':total+' განაცხადი მოიძებნა'}</span>
    {lastFetched&&<small>განახლებულია: {dates(lastFetched.toISOString())}</small>}
   </div>
  </div>
  {notice&&<p role="status" className="jmc-manager-notice">{notice}</p>}
  {error&&<p role="alert" className="jmc-cms-users-error">{error}</p>}
  <div className="jmc-manager-table" role="region" aria-label="Test Drive განაცხადები" tabIndex={0}>
   <table><thead><tr><th>მომხმარებელი</th><th>მოდელი / თარიღი</th><th>წყარო</th>
    <th>სტატუსი</th><th>შენიშვნა</th><th>მოქმედება</th></tr></thead>
    <tbody>{data.map(item=>{
     const current=draft(item);
     const dirty=current.status!==item.status||current.notes.trim()!==(item.notes||'').trim();
     return <tr key={item.id}>
      <td><strong>{item.full_name}</strong><a className="jmc-lead-phone" href={'tel:'+item.phone}>{item.phone}</a>
       <small>მიღებულია: {dates(item.created_at)}</small>
       <small>განახლებულია: {dates(item.updated_at)}</small></td>
      <td><strong>{models.find(m=>m.value===item.model_slug)?.label||item.model_slug}</strong>
       <small>{item.preferred_date||'თარიღი შესათანხმებელია'}</small></td>
      <td>{item.source||'Direct'}<small>{item.campaign||item.medium||'—'}</small></td>
      <td><select aria-label={'სტატუსი: '+item.full_name} value={current.status}
       onChange={e=>setDrafts(old=>({...old,[item.id]:{...current,status:e.target.value as Status}}))}>
        {statuses.map(st=><option key={st.value} value={st.value}>{st.label}</option>)}
       </select></td>
      <td><textarea aria-label={'შენიშვნა: '+item.full_name} maxLength={1000} rows={2}
       value={current.notes} onChange={e=>setDrafts(old=>({...old,[item.id]:{...current,notes:e.target.value}}))}/></td>
      <td><button type="button" className="button" disabled={Boolean(saving)||!dirty}
       onClick={()=>void save(item)}>{saving===item.id?'ინახება…':'შენახვა'}</button></td>
     </tr>})}</tbody>
   </table>
   {!loading&&data.length===0&&<div className="jmc-lead-empty"><strong>განაცხადები არ მოიძებნა</strong>
    <p>{total===0&&(search||statusFilter!=='all'||modelFilter!=='all'||days!=='all')
      ?'შეცვალე ფილტრები ან დაბრუნდი ყველა განაცხადზე.'
      :'ახალი Test Drive მოთხოვნები აქ გამოჩნდება გააქტიურების შემდეგ.'}</p>
    <button type="button" className="button" onClick={()=>{
     setSearch('');setStatusFilter('all');setModelFilter('all');setDays('all');setPage(1);
    }}>ყველას ჩვენება</button>
   </div>}
  </div>
  {totalPages>1&&<nav className="jmc-lead-pagination" aria-label="განაცხადების გვერდები">
   <button type="button" className="button" disabled={loading||page===1}
    onClick={()=>setPage(p=>Math.max(1,p-1))}>წინა გვერდი</button>
   <span>გვერდი {page} / {totalPages}</span>
   <button type="button" className="button" disabled={loading||page>=totalPages}
    onClick={()=>setPage(p=>p+1)}>შემდეგი გვერდი</button>
  </nav>}
 </div>;
}
