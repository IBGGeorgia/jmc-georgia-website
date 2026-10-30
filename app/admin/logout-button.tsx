'use client';
import {useState} from 'react';
export function CMSLogout(){
 const [busy,setBusy]=useState(false);
 return <button type="button" className="jmc-admin-logout" disabled={busy}
  onClick={async()=>{
   setBusy(true);
   try{
    const response=await fetch('/api/lead-manager/auth',{method:'DELETE',cache:'no-store'});
    if(response.ok)window.location.assign('/admin');
    else setBusy(false);
   }catch{setBusy(false)}
  }}>{busy?'გასვლა…':'გასვლა'}</button>;
}
