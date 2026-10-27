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
 return <div><p className="muted" id="trim-help">აირჩიე შესადარებელი კომპლექტაციები. განსხვავებული მახასიათებლები გამოკვეთილია.</p><div className="trim-switches" aria-label="შესადარებელი კომპლექტაციები">{trims.map(t=><label key={t.id} className="filter-chip"><input type="checkbox" checked={ids.includes(t.id)} onChange={e=>setIds(prev=>e.target.checked?[...prev,t.id]:prev.filter(id=>id!==t.id))}/>{t.name}</label>)}</div>{selected.length===0?<p className="catalogue-compare-empty" role="status">აირჩიე ერთი კომპლექტაცია მაინც შესადარებლად.</p>:<div className="comparison-scroll" role="region" aria-label="კომპლექტაციების შედარების ცხრილი" tabIndex={0}><table className="comparison"><thead><tr><th scope="col">მახასიათებელი</th>{selected.map(t=><th scope="col" key={t.id}>{t.name}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.label}><th scope="row">{r.label}</th>{selected.map(t=><td className={selected.length>1&&new Set(selected.map(x=>r.value(x))).size>1?'comparison-different':''} key={t.id}>{r.value(t)}</td>)}</tr>)}{featureNames.map(name=><tr key={name}><th scope="row">{name}</th>{selected.map(t=><td className={selected.length>1&&new Set(selected.map(x=>x.features.find(f=>f.label===name)?.value??'—')).size>1?'comparison-different':''} key={t.id}>{t.features.find(f=>f.label===name)?.value??'—'}</td>)}</tr>)}</tbody></table></div>}</div>;
}