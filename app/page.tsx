import Link from 'next/link';
import { Header, Footer } from './site-components';
import {vehicles} from '../lib/vehicles';

const steps = [
  { id: '01', title: 'აირჩიე ავტომობილი', text: 'გაეცანი JMC-ის მოდელებს და შეარჩიე შენი საჭიროებების შესაბამისი ავტომობილი.' },
  { id: '02', title: 'შეადარე კომპლექტაციები', text: 'ერთ სივრცეში შეადარე ტექნიკური მახასიათებლები და აღჭურვილობა.' },
  { id: '03', title: 'გაეცანი ტესტ-დრაივს', text: 'შეიტყვე დაჯავშნის მიმდინარე სტატუსი და იპოვე JMC Georgia-ს მისამართი.' },
];

export default function Home() {
  return <><Header /><main>
    <section className="hero hero-editorial" aria-labelledby="hero-title">
      <div className="container hero-content">
        <p className="eyebrow light">JMC Georgia · ოფიციალური წარმომადგენლობა</p>
        <h1 id="hero-title">შენი გზა.<br/><span>ახალი შესაძლებლობები.</span></h1>
        <p className="lead">აღმოაჩინე JMC საქართველოში — გაეცანი ავტომობილებს, შეადარე კომპლექტაციები და დაგეგმე მომავალი ტესტ-დრაივი.</p>
        <div className="actions"><Link href="/vehicles/vigus" className="button">აღმოაჩინე Vigus <span aria-hidden="true">↗</span></Link><Link href="/test-drive" className="button button-ghost">ტესტ-დრაივის ინფორმაცია <span aria-hidden="true">→</span></Link></div>
      </div>
      <div className="hero-bottom"><div className="container hero-bottom-inner"><span>JMC / Georgia</span><span>ავტომობილები საქართველოში</span><a href="#discover" aria-label="გადადით შემდეგ სექციაზე">აღმოაჩინე ↓</a></div></div>
    </section>

    <section id="discover" className="section introduction"><div className="container intro-grid">
      <div><p className="eyebrow">აღმოაჩინე JMC</p><h2>ავტომობილი, რომელიც შენს გეგმებს ერგება.</h2></div>
      <div className="intro-copy"><p>ყოველდღიური მარშრუტებიდან ახალ გამოწვევებამდე — JMC Georgia-ს საიტზე შეძლებ მოდელების გაცნობას, კომპლექტაციების შედარებას და გადაწყვეტილების მიღებისთვის საჭირო ინფორმაციის მიღებას.</p><Link href="/vehicles" className="text-link">ნახე ყველა მოდელი <span aria-hidden="true">↗</span></Link></div>
    </div></section>

    <section className="jmc-editorial-lineup" aria-labelledby="lineup-title">
      <div className="container jmc-lineup-heading">
        <div><p className="eyebrow">JMC / MODEL RANGE</p><h2 id="lineup-title">სამი ხასიათი.<br/><span>ერთი მიმართულება.</span></h2></div>
        <Link href="/vehicles" className="text-link">ყველა მოდელი ↗</Link>
      </div>
      {vehicles.filter(model=>model.slug==='grand-avenue-pro').map(model=>
        <article className="jmc-lineup-feature" key={model.slug}>
          <img src={model.heroImage} alt="JMC Grand Avenue PRO — მთავარი ფოტო" loading="lazy"/>
          <div className="jmc-lineup-feature-shade"/>
          <div className="container jmc-lineup-feature-content">
            <span>01 / FEATURED PICKUP</span>
            <h3>GRAND AVENUE <em>PRO</em></h3>
            <p>ყველა გზა ახალი შესაძლებლობაა.</p>
            <Link href={`/vehicles/${model.slug}`} className="jmc-lineup-pill">აღმოაჩინე PRO <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
      )}
      <div className="container jmc-lineup-secondary">
        {vehicles.filter(model=>model.slug!=='grand-avenue-pro').map((model,i)=>
          <article key={model.slug} className="jmc-lineup-secondary-card">
            <Link href={`/vehicles/${model.slug}`} className="jmc-lineup-secondary-visual"><img src={model.slug==='vigus'?'/images/vigus/adventure-3.webp':model.heroImage} alt={`JMC ${model.name}`} loading="lazy"/><span aria-hidden="true">↗</span></Link>
            <div className="jmc-lineup-secondary-copy"><span>{String(i+2).padStart(2,'0')} / JMC PICKUP</span><h3>{model.name}</h3><p>{model.slug==='vigus'?'მზად ყოველდღიური გზებისა და ახალი გამოწვევებისთვის.':'დიზაინი და შესაძლებლობები, რომლებიც გზას სცდება.'}</p><Link href={`/vehicles/${model.slug}`}>გაიცანი მოდელი ↗</Link></div>
          </article>
        )}
      </div>
    </section>

    <section className="section steps-section"><div className="container"><div className="section-head"><div><p className="eyebrow">მარტივი პროცესი</p><h2>არჩევანიდან პირველ შეხვედრამდე</h2></div></div><div className="steps-grid">{steps.map(step=><article className="step" key={step.id}><span className="step-num">{step.id}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></div></section>

    <section className="section action-section"><div className="container"><div className="action-banner"><div><p className="eyebrow light">JMC Georgia</p><h2>იპოვე JMC Georgia.<br/>გაიგე მეტი.</h2><p>ჩვენი მისამართია: თბილისი, ბელიაშვილის 115. აღმოაჩინე მოდელის შესახებ ინფორმაცია და დაგეგმე შემდეგი ნაბიჯი.</p></div><div className="action-banner-buttons"><Link href="/contact" className="button">მისამართის ნახვა ↗</Link><Link href="/about" className="button button-ghost">ჩვენ შესახებ →</Link></div></div></div></section>
  </main><Footer/></>;
}
