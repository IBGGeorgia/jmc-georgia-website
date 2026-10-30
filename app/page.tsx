import HomeExperience from './home-experience';
import {studioImageFor} from '../lib/studio-images';
import {JmcIcon} from './jmc-icons';
import Link from 'next/link';
import { Header, Footer } from './site-components';
import {vehicles} from '../lib/vehicles';
import './home-experience.css';

const steps = [
  { id: '01', title: 'აირჩიე ავტომობილი', text: 'გაეცანი JMC-ის მოდელებს და შეარჩიე შენი საჭიროებების შესაბამისი ავტომობილი.' },
  { id: '02', title: 'შეადარე კომპლექტაციები', text: 'ერთ სივრცეში შეადარე ტექნიკური მახასიათებლები და აღჭურვილობა.' },
  { id: '03', title: 'გაეცანი ტესტ-დრაივს', text: 'შეიტყვე დაჯავშნის მიმდინარე სტატუსი და იპოვე JMC Georgia-ს მისამართი.' },
];

export default function Home() {
  return <><Header /><main>
    <HomeExperience items={vehicles.map(model=>({slug:model.slug,name:model.name,image:studioImageFor(model.slug,model.heroImage),description:model.description}))}/>

    <section id="discover" className="section introduction"><div className="container intro-grid">
      <div><p className="eyebrow">აღმოაჩინე JMC</p><h2>ავტომობილი, რომელიც შენს გეგმებს ერგება.</h2></div>
      <div className="intro-copy"><p>ყოველდღიური მარშრუტებიდან ახალ გამოწვევებამდე — JMC Georgia-ს საიტზე შეძლებ მოდელების გაცნობას, კომპლექტაციების შედარებას და გადაწყვეტილების მიღებისთვის საჭირო ინფორმაციის მიღებას.</p><Link href="#models" className="text-link">აირჩიე მოდელი <JmcIcon name="arrow-up-right"/></Link></div>
    </div></section>

    <section className="section steps-section"><div className="container"><div className="section-head"><div><p className="eyebrow">მარტივი პროცესი</p><h2>არჩევანიდან პირველ შეხვედრამდე</h2></div></div><div className="steps-grid">{steps.map(step=><article className="step" key={step.id}><span className="step-num">{step.id}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></div></section>

    <section className="section action-section"><div className="container"><div className="action-banner"><div><p className="eyebrow light">JMC Georgia</p><h2>იპოვე JMC Georgia.<br/>გაიგე მეტი.</h2><p>ჩვენი მისამართია: თბილისი, ბელიაშვილის 115. აღმოაჩინე მოდელის შესახებ ინფორმაცია და დაგეგმე შემდეგი ნაბიჯი.</p></div><div className="action-banner-buttons"><Link href="/contact" className="button">მისამართის ნახვა <JmcIcon name="arrow-up-right"/></Link><Link href="/about" className="button button-ghost">ჩვენ შესახებ <JmcIcon name="arrow-right"/></Link></div></div></div></section>
  </main><Footer/></>;
}
