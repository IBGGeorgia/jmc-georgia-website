'use client';
import {useState} from 'react';
import type {Trim} from '../../../lib/vehicles';

const rows:{label:string;value:(t:Trim)=>string}[]=[
 {label:'ფასი',value:t=>t.priceGEL==null?'დაზუსტდება':new Intl.NumberFormat('ka-GE').format(t.priceGEL)+' ₾'},
 {label:'ძრავა',value:t=>t.powertrain??'დაზუსტდება'},
 {label:'გადაცემათა კოლოფი',value:t=>t.transmission??'დაზუსტდება'},
 {label:'ამძრავი',value:t=>t.drivetrain??'დაზუსტდება'}
];
type ComparisonRow={label:string;values:string[];different:boolean};
export function TrimComparison({trims}:{trims:Trim[]}){
 const [ids,setIds]=useState<string[]>(()=>trims.slice(0,3).map(t=>t.id));
 if(trims.length===0)return <p className="muted">კომპლექტაციების მახასიათებლები დაემატება დადასტურების შემდეგ.</p>;
 const selected=trims.filter(t=>ids.includes(t.id));
 const featureNames=Array.from(new Set(selected.flatMap(t=>t.features.map(f=>f.label))));
 const comparisonRows:ComparisonRow[]=[
  ...rows.map(r=>({label:r.label,values:selected.map(t=>r.value(t))})),
  ...featureNames.map(label=>({label,values:selected.map(t=>t.features.find(f=>f.label===label)?.value??'—')}))
 ].map(r=>({...r,different:r.values.length>1&&new Set(r.values).size>1}));
 const differenceCount=comparisonRows.filter(r=>r.different).length;
 return <div className="vigus-compare-ui">
  <div className="vigus-compare-toolbar">
   <div>
    <p className="vigus-compare-intro" id="trim-help">აირჩიე კომპლექტაციები და შეადარე მათი მახასიათებლები.</p>
    <p className="vigus-compare-meta" role="status">{selected.length} არჩეული კომპლექტაცია{selected.length>1?` · ${differenceCount} განსხვავებული მახასიათებელი`:''}</p>
   </div>
   <div className="trim-switches" role="group" aria-label="შესადარებელი კომპლექტაციები" aria-describedby="trim-help">
    {trims.map(t=><label key={t.id} className="filter-chip"><input type="checkbox" checked={ids.includes(t.id)} onChange={e=>setIds(prev=>e.target.checked?[...prev,t.id]:prev.filter(id=>id!==t.id))}/>{t.name}</label>)}
   </div>
  </div>
  {selected.length===0
   ?<p className="catalogue-compare-empty" role="status">აირჩიე ერთი კომპლექტაცია მაინც შესადარებლად.</p>
   :<>
    <div className="comparison-scroll" role="region" aria-label="კომპლექტაციების შედარების ცხრილი" tabIndex={0}>
     <table className="comparison">
      <thead><tr><th scope="col">მახასიათებელი</th>{selected.map(t=><th scope="col" key={t.id}>{t.name}</th>)}</tr></thead>
      <tbody>{comparisonRows.map(r=><tr key={r.label}><th scope="row">{r.label}</th>{selected.map((t,i)=><td className={r.different?'comparison-different':''} key={t.id}>{r.values[i]}</td>)}</tr>)}</tbody>
     </table>
    </div>
    <div className="vigus-compare-mobile" aria-label="კომპლექტაციების მობილური შედარება">
     {selected.map((t,i)=><section className="vigus-compare-card" key={t.id} aria-label={t.name}>
      <header className="vigus-compare-card-head"><span>კომპლექტაცია</span><h4>{t.name}</h4></header>
      <dl>{comparisonRows.map(r=><div className={r.different?'is-different':''} key={r.label}><dt>{r.label}</dt><dd>{r.values[i]}</dd></div>)}</dl>
     </section>)}
    </div>
   </>
  }
  {selected.length>1&&differenceCount>0&&<p className="vigus-compare-legend"><span aria-hidden="true"/> განსხვავებული მახასიათებლები მონიშნულია</p>}
 </div>;
}