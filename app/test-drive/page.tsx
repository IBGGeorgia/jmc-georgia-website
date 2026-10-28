import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer } from '../site-components';

export const metadata:Metadata={
 title:'ტესტ-დრაივი',
 description:'JMC Georgia — ტესტ-დრაივის დაჯავშნის ინფორმაცია და JMC Vigus-ის გაცნობა.'
};

export default function TestDrive(){
 return <>
  <Header/>
  <main className="container jmc-test-drive-page">
   <div className="page-head">
    <p className="eyebrow">JMC Georgia</p>
    <h1>ტესტ-დრაივი</h1>
    <p className="muted">გაიცანი JMC Vigus და დაგეგმე ავტომობილის დათვალიერება.</p>
   </div>
   <section className="jmc-test-drive-panel" aria-labelledby="test-drive-status">
    <div className="jmc-test-drive-panel-copy">
     <p className="jmc-test-drive-status-label">ონლაინ დაჯავშნა</p>
     <h2 id="test-drive-status">ფორმა მალე დაემატება.</h2>
     <p>ტესტ-დრაივის ონლაინ განაცხადები ამ ეტაპზე არ მიიღება. მანამდე შეგიძლია გაეცნო Vigus-ის მახასიათებლებს და ნახო ჩვენი მისამართი.</p>
     <div className="jmc-test-drive-actions">
      <Link className="button" href="/vehicles/vigus">აღმოაჩინე Vigus <span aria-hidden="true">↗</span></Link>
      <Link className="jmc-test-drive-secondary" href="/contact">მისამართის ნახვა <span aria-hidden="true">↗</span></Link>
     </div>
    </div>
    <div className="jmc-test-drive-panel-aside">
     <span className="jmc-test-drive-aside-label">JMC Georgia</span>
     <address>თბილისი, ბელიაშვილის 115</address>
    </div>
   </section>
  </main>
  <Footer/>
 </>;
}
