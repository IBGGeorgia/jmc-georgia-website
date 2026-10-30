import './test-drive.css';
import {isTestDriveReady} from '../../lib/test-drive-server';
import {TestDriveForm} from './test-drive-form';
import {studioImageFor} from '../../lib/studio-images';
import {JmcIcon} from '../jmc-icons';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '../site-components';
import {vehicles} from '../../lib/vehicles';

export const metadata:Metadata={
 title:'ტესტ-დრაივი',
 description:'JMC Georgia — ტესტ-დრაივის დაჯავშნის ინფორმაცია და JMC Vigus-ის, Grand Avenue-ისა და Grand Avenue PRO-ის გაცნობა.'
};

export const dynamic='force-dynamic';
export default function TestDrive(){
 return <>
  <Header/>
  <main className="container jmc-test-drive-page">
   <header className="page-head jmc-page-intro">
    <p className="eyebrow">JMC Georgia</p>
    <h1>ტესტ-დრაივი</h1>
    <p className="jmc-page-lead">აირჩიე სასურველი ავტომობილი და გაეცანი ტესტ-დრაივის მოთხოვნის პროცესს.</p>
   </header>
   <section className="jmc-test-drive-panel" aria-labelledby="test-drive-status">
    <div className="jmc-test-drive-panel-copy">
     <p className="jmc-test-drive-status-label">ონლაინ დაჯავშნა</p>
     <h2 id="test-drive-status">Test Drive — დაჯავშნის სისტემა მზადდება</h2>
     <p>სისტემის საბოლოო გამართვამდე ტესტ-დრაივის ონლაინ განაცხადები ამ ეტაპზე არ მიიღება. მანამდე შეგიძლია შეარჩიო მოდელი, გაეცნო მოთხოვნის ფორმას და ნახო ჩვენი მისამართი.</p>
     <div className="jmc-test-drive-actions">
      <Link className="button" href="/vehicles">ნახე ყველა მოდელი <JmcIcon name="arrow-up-right"/></Link>
      <Link className="jmc-test-drive-secondary" href="/contact">მისამართის ნახვა <JmcIcon name="arrow-up-right"/></Link>
     </div>
    </div>
    <div className="jmc-test-drive-panel-aside">
     <span className="jmc-test-drive-aside-label">JMC Georgia</span>
     <address>თბილისი, ბელიაშვილის 115</address>
    </div>
   </section>
   <TestDriveForm ready={isTestDriveReady()}/>
   <section className="jmc-test-drive-models" aria-label="აირჩიე მოდელი"><h2>გაიცანი მოდელები</h2><div className="jmc-home-model-grid">{vehicles.map(model=><article className="jmc-home-model-card" key={model.slug}><Link className="jmc-home-model-image jmc-studio-surface" href={`/vehicles/${model.slug}`}><img className={model.slug==='vigus'?'jmc-vigus-image jmc-vigus-image-test-drive':undefined} src={studioImageFor(model.slug,model.heroImage)} loading="lazy" alt={`JMC ${model.name}`}/></Link><div className="jmc-home-model-content"><h3>{model.name}</h3><Link href={`/vehicles/${model.slug}`} className="button">მახასიათებლების ნახვა <JmcIcon name="arrow-up-right"/></Link></div></article>)}</div></section>
  </main>
  <Footer/>
 </>;
}
