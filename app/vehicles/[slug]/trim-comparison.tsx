'use client';
import {useState} from 'react';
import type {Trim} from '../../../lib/vehicles';
const rows: {label:string; value:(t:Trim)=>string}[] = [
 {label:'ფასი',value:t=>t.priceGEL==null?'დაზუსტდება':new Intl.NumberFormat('ka-GE').format(t.priceGEL)+' ₾'},
 {label:'ძრავა',value:t=>t.powertrain??'დაზუსტდება'},
 {label:'გადაცემათა კოლოფი',value:t=>t.transmission??'დაზუსტდება'},
 {label:'ამძრავი',value:t=>t.drivetrain??'დაზუსტდება'}
];
export function TrimComparison({trims}:{trims:Trim[]}){
 const [ids,setIds]=useState<string[]>(trims.slice(0,3).map(t=>t.id));
 const selected=trims.filter(t=>ids.includes(t.id));
 if(trims.length===0)return <p className="muted">კომპლექტაციების მახასიათებლები დაემატება დადასტურების შემდეგ.</p>;
 const featureNames=Array.from(new Set(selected.flatMap(t=>t.features.map(f=>f.label))));
 return <div><div className="trim-switches" aria-label="შესადარებელი კომპლექტაციები">{trims.map(t=><label key={t.id} className="filter-chip"><input type="checkbox" checked={ids.includes(t.id)} onChange={e=>setIds(prev=>e.target.checked?[...prev,t.id]:prev.filter(id=>id!==t.id))}/>{t.name}</label>)}</div><div className="comparison-scroll"><table className="comparison"><thead><tr><th scope="col">მახასიათებელი</th>{selected.map(t=><th scope="col" key={t.id}>{t.name}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.label}><th scope="row">{r.label}</th>{selected.map(t=><td key={t.id}>{r.value(t)}</td>)}</tr>)}{featureNames.map(name=><tr key={name}><th scope="row">{name}</th>{selected.map(t=><td key={t.id}>{t.features.find(f=>f.label===name)?.value??'—'}</td>)}</tr>)}</tbody></table></div></div>;
}