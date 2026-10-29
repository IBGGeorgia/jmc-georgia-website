import {studioImageFor} from '../../lib/studio-images';
import {JmcIcon} from '../jmc-icons';
import Link from 'next/link';
import {Header,Footer} from '../site-components';
import {vehicles} from '../../lib/vehicles';

export default function VehiclesCatalogue(){
 return <><Header/><main className="container jmc-models-page">
  <header className="page-head jmc-page-intro">
   <p className="eyebrow">JMC Georgia</p><h1>ავტომობილები</h1>
   <p className="jmc-page-lead">აღმოაჩინე JMC-ის მოდელები და გაეცანი მათ მახასიათებლებს.</p>
  </header>
  <div style={{marginBottom:28}}><Link href="/compare" className="button">შეადარე მოდელები <JmcIcon name="arrow-up-right"/></Link></div>
  <section className="jmc-home-model-grid" aria-label="ავტომობილების კატალოგი">
   {vehicles.map((model,i)=><article key={model.slug} className="jmc-home-model-card">
    <Link href={`/vehicles/${model.slug}`} className="jmc-home-model-image jmc-studio-surface">
     <img className={model.slug==='vigus'?'jmc-vigus-image jmc-vigus-image-catalogue':undefined} src={studioImageFor(model.slug,model.heroImage)} alt={`JMC ${model.name}`} loading="lazy"/>
    </Link>
    <div className="jmc-home-model-content">
     <span>{String(i+1).padStart(2,'0')} / JMC</span><h2>{model.name}</h2>
     <p>{model.description}</p>
     <Link href={`/vehicles/${model.slug}`} className="button">მოდელის ნახვა <JmcIcon name="arrow-up-right"/></Link>
    </div>
   </article>)}
  </section>
 </main><Footer/></>;
}
