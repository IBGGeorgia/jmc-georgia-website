import {studioImageFor} from '../../lib/studio-images';
'use client';
import {useState} from 'react';
import Link from 'next/link';
import {vehicles} from '../../lib/vehicles';
import {JmcIcon} from '../jmc-icons';

const initial=vehicles.slice(0,2).map(v=>v.slug);
const labels:{label:string;field:'powertrain'|'drivetrain'|'transmission'}[]=[
 {label:'ძრავი',field:'powertrain'},{label:'ამძრავი',field:'drivetrain'},{label:'ტრანსმისია',field:'transmission'}
];
export function VehicleComparison(){
 const [selected,setSelected]=useState<string[]>(initial);
 const [trims,setTrims]=useState<Record<string,string>>({});
 const [onlyDifferent,setOnlyDifferent]=useState(false);
 const choices=selected.map(slug=>vehicles.find(v=>v.slug===slug)).filter((v):v is typeof vehicles[number]=>Boolean(v));
 const picked=choices.map(v=>v.trims.find(t=>t.id===trims[v.slug])??v.trims[0]);
 const features=[...new Set(picked.flatMap(t=>t?.features.map(f=>f.label)??[]))];
 const rows=[
  ...labels.map(({label,field})=>({label,values:picked.map(t=>t?.[field]||'—')})),
  ...features.map(label=>({label,values:picked.map(t=>t?.features.find(f=>f.label===label)?.value||'—')}))
 ].filter(r=>!onlyDifferent||new Set(r.values).size>1);
 function changeModel(index:number,slug:string){
  setSelected(old=>old.map((value,i)=>i===index?slug:value));
 }
 return <section className="jmc-compare-workspace" aria-label="მოდელების შედარება">
  <div className="jmc-compare-controls">
   {choices.map((model,i)=><div className="jmc-compare-slot jmc-studio-selector" key={i}>
    <label htmlFor={`compare-model-${i}`}>მოდელი {i+1}</label>
    <select id={`compare-model-${i}`} value={model.slug} onChange={e=>changeModel(i,e.target.value)}>
     {vehicles.map(v=><option value={v.slug} key={v.slug} disabled={selected.some((x,j)=>j!==i&&x===v.slug)}>{v.name}</option>)}
    </select>
    <img className={model.slug==='vigus'?'jmc-vigus-image jmc-vigus-image-compare-selector':undefined} src={studioImageFor(model.slug,model.heroImage)} alt={`JMC ${model.name}`} loading="lazy"/>
    <h2>{model.name}</h2>
    <label htmlFor={`compare-trim-${i}`}>კომპლექტაცია</label>
    <select id={`compare-trim-${i}`} value={model.trims.some(t=>t.id===trims[model.slug])?trims[model.slug]:model.trims[0]?.id??''}
     onChange={e=>setTrims(old=>({...old,[model.slug]:e.target.value}))}>
     {model.trims.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
    </select>
    <Link href={`/vehicles/${model.slug}`} className="jmc-compare-detail">მოდელის გვერდი <JmcIcon name="arrow-up-right"/></Link>
   </div>)}
   {selected.length<Math.min(3,vehicles.length)&&<button type="button" className="jmc-compare-add" onClick={()=>setSelected(old=>[...old,vehicles.find(v=>!old.includes(v.slug))!.slug])}><JmcIcon name="plus"/> მესამე მოდელის დამატება</button>}
  </div>
  {selected.length===3&&<button type="button" className="jmc-compare-remove" onClick={()=>setSelected(old=>old.slice(0,2))}>მესამე მოდელის ამოღება</button>}
  <div className="jmc-compare-insight" aria-live="polite"><h3>რას გვაჩვენებს ეს შედარება?</h3><p>{onlyDifferent ? `არჩეულ კომპლექტაციებს შორის ${rows.length} განსხვავებული პარამეტრია გამოყოფილი. ცხრილში მხოლოდ ის ველები ჩანს, რომელთა მითითებული მნიშვნელობები ერთმანეთს არ ემთხვევა.` : `ამჟამად ერთმანეთს ადარებ ${choices.map(v=>v.name).join(' და ')}-ს. შეცვალე კომპლექტაციები, შემდეგ ჩართე „მხოლოდ განსხვავებები“, რომ მათი მონაცემების შედარება გაამარტივო.`}</p></div>
  <div className="jmc-compare-table-heading"><h2>ტექნიკური მონაცემები</h2><label className="jmc-compare-toggle"><input type="checkbox" checked={onlyDifferent} onChange={e=>setOnlyDifferent(e.target.checked)}/> მხოლოდ განსხვავებები</label></div>
  <div className="jmc-compare-scroll" role="region" aria-label="მოდელების მახასიათებლების შედარების ცხრილი" tabIndex={0}>
   <table className="jmc-compare-table"><thead><tr><th scope="col">მახასიათებელი</th>{choices.map(v=><th key={v.slug} scope="col">{v.name}</th>)}</tr></thead>
    <tbody>{rows.map(row=><tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value,i)=><td key={choices[i].slug}>{value}</td>)}</tr>)}</tbody>
   </table>
  </div>
  {rows.length===0&&<p className="jmc-compare-empty">შერჩეულ კომპლექტაციებს შორის მონაცემებში განსხვავება არ არის.</p>}
  <p className="jmc-compare-note">შედარება ეყრდნობა გამოქვეყნებული მოდელების დადასტურებულ მონაცემებს. „—“ ნიშნავს, რომ მონაცემი მითითებული არ არის. ფასები ნაჩვენები არ არის, სანამ ოფიციალურად არ დადასტურდება.</p>
 </section>;
}
