import Link from 'next/link';
import { Header, Footer } from './site-components';

const steps = [
  { id: '01', title: 'აირჩიე ავტომობილი', text: 'გაეცანი JMC-ის მოდელებს და შეარჩიე შენი საჭიროებების შესაბამისი ავტომობილი.' },
  { id: '02', title: 'შეადარე კომპლექტაციები', text: 'ერთ სივრცეში შეადარე ტექნიკური მახასიათებლები და აღჭურვილობა.' },
  { id: '03', title: 'დაგეგმე ტესტ-დრაივი', text: 'მოითხოვე შეხვედრა და გაეცანი ავტომობილს პირადად.' },
];

export default function Home() {
  return <><Header /><main>
    <section className="hero hero-editorial" aria-labelledby="hero-title">
      <div className="hero-geometry" aria-hidden="true"><span/><span/><span/></div>
      <div className="container hero-content">
        <p className="eyebrow light">JMC Georgia <span className="eyebrow-rule" /> ოფიციალური წარმომადგენლობა</p>
        <h1 id="hero-title">შენი გზა.<br/><span>ახალი შესაძლებლობები.</span></h1>
        <p className="lead">აღმოაჩინე JMC საქართველოში — გაეცანი ავტომობილებს, შეადარე კომპლექტაციები და დაგეგმე მომავალი ტესტ-დრაივი.</p>
        <div className="actions"><Link href="/vehicles/vigus" className="button">აღმოაჩინე Vigus <span aria-hidden="true">↗</span></Link><Link href="/test-drive" className="button button-ghost">ტესტ-დრაივი <span aria-hidden="true">→</span></Link></div>
      </div>
      <div className="hero-bottom"><div className="container hero-bottom-inner"><span>JMC / Georgia</span><span>Quality · Technology · Service</span><a href="#discover" aria-label="გადადით შემდეგ სექციაზე">აღმოაჩინე ↓</a></div></div>
    </section>

    <section id="discover" className="section introduction"><div className="container intro-grid">
      <div><p className="eyebrow">აღმოაჩინე JMC</p><h2>ავტომობილი, რომელიც შენს გეგმებს ერგება.</h2></div>
      <div className="intro-copy"><p>ყოველდღიური მარშრუტებიდან ახალ გამოწვევებამდე — JMC Georgia-ს საიტზე შეძლებ მოდელების გაცნობას, კომპლექტაციების შედარებას და გადაწყვეტილების მიღებისთვის საჭირო ინფორმაციის მიღებას.</p><Link href="/vehicles/vigus" className="text-link">გაეცანი JMC Vigus-ს <span aria-hidden="true">↗</span></Link></div>
    </div></section>

    <section className="section catalogue-feature"><div className="container">
      <div className="section-head"><div><p className="eyebrow">JMC-ის ავტომობილები</p><h2>აღმოაჩინე მოდელების ხაზი</h2><p className="section-sub">პირველი მოდელი საქართველოში — JMC Vigus. გაიგე მეტი მისი შესაძლებლობებისა და კომპლექტაციების შესახებ.</p></div><Link href="/vehicles/vigus" className="text-link">JMC Vigus ↗</Link></div>
      <div className="vehicle-preview"><div className="vehicle-preview-visual"><img src="https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261027_211343_7b3d12f5-0f3c-4964-9db2-14f404ec25be.png" alt="JMC Vigus პიკაპი" loading="lazy" className="home-vigus-product"/></div><div className="vehicle-preview-copy"><span className="preview-index">01 / Model lineup</span><h3>JMC Vigus — აღმოაჩინე დეტალები.</h3><p>ფოტოები, აღჭურვილობა, მახასიათებლები და Trim Comparison — ერთიანი ციფრული კატალოგი არჩევანის გასამარტივებლად.</p><Link href="/vehicles/vigus" className="button">აღმოაჩინე Vigus <span aria-hidden="true">↗</span></Link><small>ორი კომპლექტაცია — AT და MT.</small></div></div>
    </div></section>

    <section className="section steps-section"><div className="container"><div className="section-head"><div><p className="eyebrow">მარტივი პროცესი</p><h2>არჩევანიდან პირველ შეხვედრამდე</h2></div></div><div className="steps-grid">{steps.map(step=><article className="step" key={step.id}><span className="step-num">{step.id}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></div></section>

    <section className="section action-section"><div className="container"><div className="action-banner"><div><p className="eyebrow light">JMC Georgia</p><h2>გაქვს შეკითხვა?<br/>დავიწყოთ საუბარი.</h2><p>დაგვიკავშირდი სასურველი მოდელის, ხელმისაწვდომობის ან კომპლექტაციის შესახებ.</p></div><div className="action-banner-buttons"><Link href="/contact" className="button">დაგვიკავშირდი ↗</Link><Link href="/about" className="button button-ghost">ჩვენ შესახებ →</Link></div></div></div></section>
  </main><Footer/></>;
}
