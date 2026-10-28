'use client';
import {useMemo,useState} from 'react';
import {getProVariant,proSourceVariants,type ProTrim,type ProFuel} from '../../../lib/grand-avenue-pro';
const equipmentCategories:[string,string][]=[['exterior','ექსტერიერი'],['interior','ინტერიერი'],['safety','უსაფრთხოება'],['offroad','Off-road']];
const fuelName=(fuel:ProFuel)=>fuel==='diesel'?'დიზელი':'ბენზინი';
const fields=['engine','power','transmission','clearance','kerb','gross','tank','emissions','dimensions','cargo_length','cargo_width','cargo_height','wheelbase','wheels'];
/** Draft-only configurator; keep unmounted until the full photo-backed page is approved. */
export function GrandAvenueProConfigurator(){
 const [trim,setTrim]=useState<ProTrim>('LX');
 const [fuel,setFuel]=useState<ProFuel>('diesel');
 const [comparison,setComparison]=useState<string[]>(['avenue_lx_d','avenue_slx_d']);
 const [diffOnly,setDiffOnly]=useState(false);
 const selected=getProVariant(trim,fuel);
 const compared=useMemo(()=>proSourceVariants.filter(v=>comparison.includes(v.id)),[comparison]);
 if(!selected)return null;
 const rows=fields.map(key=>({key,label:selected.specLabels[key]?.[0]??key,values:compared.map(v=>v.specs[key]||'—')})).filter(row=>!diffOnly||compared.length<2||new Set(row.values).size>1);
 const differenceCount=fields.filter(key=>compared.length>1&&new Set(compared.map(v=>v.specs[key]||'—')).size>1).length;
 return <div className="pro-draft-configurator">
  <p className="pro-draft-eyebrow">Grand Avenue PRO / Draft</p>
  <h2>აირჩიე შენი PRO</h2>
  <div className="pro-draft-axes">
   <fieldset><legend>კომპლექტაცია</legend><div className="pro-draft-segments">{(['LX','SLX'] as const).map(value=><button type="button" key={value} aria-pressed={trim===value} onClick={()=>setTrim(value)}>PRO {value}</button>)}</div></fieldset>
   <fieldset><legend>ძრავა</legend><div className="pro-draft-segments">{(['diesel','gasoline'] as const).map(value=><button type="button" key={value} aria-pressed={fuel===value} onClick={()=>setFuel(value)}>{fuelName(value)}</button>)}</div></fieldset>
  </div>
  <div className="pro-draft-summary" aria-live="polite" aria-atomic="true">
   <h3>PRO {trim} · {fuelName(fuel)}</h3>
   <dl>{['engine','power','transmission','clearance'].map(key=><div key={key}><dt>{selected.specLabels[key]?.[0]}</dt><dd>{selected.specs[key]}</dd></div>)}</dl>
  </div>
  <section aria-labelledby="pro-draft-tech"><h3 id="pro-draft-tech">ტექნიკური მონაცემები</h3><dl className="pro-draft-facts">{fields.filter(k=>selected.specs[k]).map(key=><div key={key}><dt>{selected.specLabels[key]?.[0]}</dt><dd>{selected.specs[key]}</dd></div>)}</dl></section>
  <section aria-labelledby="pro-draft-equipment"><h3 id="pro-draft-equipment">აღჭურვილობა · PRO {trim} · {fuelName(fuel)}</h3>
   {equipmentCategories.map(([key,title])=>{const items=selected.groups[key];const list=Array.isArray(items)?items.filter(x=>typeof x==='string'):[];return <details key={key}><summary>{title} · {list.length}</summary><ul>{list.map((v:string,i:number)=><li key={i}>{v}</li>)}</ul></details>})}
  </section>
  <section aria-labelledby="pro-draft-compare"><h3 id="pro-draft-compare">შეადარე კომპლექტაციები</h3>
   <div className="pro-draft-compare-options">{proSourceVariants.map(v=><label key={v.id}><input type="checkbox" checked={comparison.includes(v.id)} onChange={e=>setComparison(prev=>e.target.checked?[...prev,v.id]:prev.filter(x=>x!==v.id))}/> PRO {v.trim} · {fuelName(v.fuel)}</label>)}</div>
   <label className="pro-draft-diff-toggle"><input type="checkbox" checked={diffOnly} onChange={e=>setDiffOnly(e.target.checked)}/> მხოლოდ განსხვავებები <span>{differenceCount}</span></label>
   {compared.length===0?<p role="status">აირჩიე ერთი კომპლექტაცია მაინც.</p>:rows.length===0?<p role="status" className="pro-draft-no-differences">არჩეულ ვერსიებს შორის მითითებული ტექნიკური მონაცემებით განსხვავება არ გამოვლენილა. აღჭურვილობის განსხვავებები იხილე შესაბამის კატეგორიაში.</p>:
    <div className="pro-draft-compare-scroll" role="region" aria-label="PRO კომპლექტაციების შედარება" tabIndex={0}><table><thead><tr><th scope="col">მახასიათებელი</th>{compared.map(v=><th scope="col" key={v.id}>PRO {v.trim} · {fuelName(v.fuel)}</th>)}</tr></thead>
     <tbody>{rows.map(row=><tr key={row.key}><th scope="row">{row.label}</th>{row.values.map((value,i)=><td key={compared[i].id}>{value}</td>)}</tr>)}</tbody></table></div>}
  </section>
 </div>;
}
