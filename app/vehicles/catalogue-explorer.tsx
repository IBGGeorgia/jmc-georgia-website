'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {vehicles,categoryLabels,type Vehicle} from '../../lib/vehicles';
const filters = [{id:'all',name:'ყველა'},...Object.entries(categoryLabels).map(([id,name])=>({id,name}))];
export function CatalogueExplorer(){
 const [category,setCategory] = useState('all');
 const [term,setTerm] = useState('');
 const visible = useMemo(()=>vehicles.filter(v=>(category==='all'||v.category===category)&&v.name.toLocaleLowerCase().includes(term.toLocaleLowerCase())),[category,term]);
 return <section aria-label="ავტომობილების კატალოგი">
  <div className="catalogue-toolbar"><div className="catalogue-tabs" aria-label="ავტომობილის ტიპი">{filters.map(f=><button type="button" key={f.id} className={category===f.id?'filter-chip active':'filter-chip'} aria-pressed={category===f.id} onClick={()=>setCategory(f.id)}>{f.name}</button>)}</div><label className="search-label"><span className="sr-only">მოდელის ძიება</span><input type="search" value={term} onChange={e=>setTerm(e.target.value)} placeholder="მოძებნე მოდელი..." /></label></div>
  {visible.length>0?<div className="vehicle-card-grid">{visible.map((v:Vehicle)=><article className="vehicle-card" key={v.slug}><div className="vehicle-card-media">{v.heroImage?<img src={v.heroImage} alt={v.name} loading="lazy"/>:<span>JMC</span>}</div><div className="vehicle-card-body"><small>{categoryLabels[v.category]}</small><h2>{v.name}</h2><p>{v.description}</p><Link className="text-link" href={`/vehicles/${v.slug}`}>მოდელის დათვალიერება ↗</Link></div></article>)}</div>:<div className="catalogue-empty"><span className="catalogue-empty-mark" aria-hidden="true">JMC</span><h2>{vehicles.length===0?'მოდელების კატალოგს ვამზადებთ':'მითითებული ფილტრით მოდელი ვერ მოიძებნა'}</h2><p>{vehicles.length===0?'საქართველოსთვის ოფიციალურად დადასტურებული მოდელები, კომპლექტაციები და ფოტოები მალე განთავსდება.':'შეცვალე კატეგორია ან საძიებო სიტყვა.'}</p><div className="actions"><Link className="button" href="/contact">მისამართის ნახვა ↗</Link>{vehicles.length>0&&<button type="button" className="button outline" onClick={()=>{setTerm('');setCategory('all')}}>ფილტრების გასუფთავება</button>}</div></div>}
 </section>;
}
