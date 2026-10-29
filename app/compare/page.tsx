import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../site-components';
import {JmcIcon} from '../jmc-icons';
import {vehicles} from '../../lib/vehicles';
import {VehicleComparison} from './vehicle-comparison';
import {CompareMotion} from './compare-motion';
import './compare.css';

export const metadata:Metadata={
 title:'მოდელების შედარება',
 description:'გაიცანი JMC Vigus, Grand Avenue და Grand Avenue PRO. შეადარე ტექნიკური მონაცემები, კომპლექტაციები და გაარკვიე, რომელი მოდელი შეესაბამება შენს საჭიროებებს.'
};

const editorial=[
 {slug:'vigus',number:'01',eyebrow:'ყოველდღიური მრავალმხრივობა',heading:'პრაქტიკული არჩევანის თავისუფლება',
  copy:'VIGUS-ის ხაზში ორი 4×4 კომპლექტაციაა: 8-საფეხურიანი ავტომატური და 6-საფეხურიანი მექანიკური ტრანსმისიით. თუ არჩევანისას გადამწყვეტია მართვის სტილი, დაიწყე სწორედ ამ განსხვავებით.'},
 {slug:'grand-avenue',number:'02',eyebrow:'საკუთარი ხასიათი',heading:'გაიცანი Grand Avenue დეტალურად',
  copy:'Grand Avenue-ის შეფასებისას მხოლოდ ძრავის მაჩვენებლებით ნუ შემოიფარგლები: გადახედე გაბარიტებს, აღჭურვილობასა და უსაფრთხოების მახასიათებლებს. ზუსტი მონაცემები იხილე ქვემოთ შედარების ცხრილში.'},
 {slug:'grand-avenue-pro',number:'03',eyebrow:'კომპლექტაციების არჩევანი',heading:'მეტი ვარიანტი ერთ მოდელში',
  copy:'Grand Avenue PRO-ის ხაზში წარმოდგენილია LX და SLX, დიზელისა და ბენზინის ვერსიებით. აქ განსაკუთრებით მნიშვნელოვანია კონკრეტული კომპლექტაციის არჩევა — მის მიხედვით ცხრილში მონაცემებიც შეიცვლება.'}
] as const;

export default function ComparePage(){
 return <><Header/><CompareMotion/><main className="container jmc-compare-page">
  <header className="page-head jmc-page-intro jmc-compare-intro">
   <p className="eyebrow">JMC საქართველო · მოდელების შედარება</p>
   <h1>სამი მოდელი.<br/>შენი არჩევანი.</h1>
   <p className="jmc-page-lead">აირჩიე შენთვის შესაფერისი JMC. გაიცანი მოდელების განსხვავებები, შეადარე კომპლექტაციები და მიიღე გადაწყვეტილება რეალურ მონაცემებზე დაყრდნობით.</p>
   <a className="jmc-compare-jump" href="#compare-workspace">დაიწყე შედარება <JmcIcon name="arrow-down"/></a>
  </header>
  <section className="jmc-compare-editorial" aria-labelledby="compare-story-title">
   <div className="jmc-compare-story-heading"><p className="eyebrow">01 / მოდელების გაცნობა</p><h2 id="compare-story-title">რით იწყება სწორი არჩევანი?</h2><p>სანამ ტექნიკურ ცხრილს შეადარებ, გაიცანი თითოეული მოდელის შესაძლებლობების ძირითადი მიმართულება. ქვემოთ მოცემული აღწერები ეყრდნობა გამოქვეყნებულ მოდელებსა და კომპლექტაციებს — არა ვარაუდს მათი უპირატესობის შესახებ.</p></div>
   <div className="jmc-compare-stories">{editorial.map(item=>{
    const vehicle=vehicles.find(v=>v.slug===item.slug);
    if(!vehicle)return null;
    return <article className="jmc-compare-story" key={item.slug}>
     <Link href={`/vehicles/${item.slug}`} className="jmc-compare-story-image" aria-label={`${vehicle.name} — მოდელის ნახვა`}>
      <img src={vehicle.heroImage} loading="lazy" alt={`JMC ${vehicle.name}`}/>
     </Link>
     <div className="jmc-compare-story-body"><span className="jmc-compare-story-index">{item.number} / {vehicle.name}</span><span className="jmc-compare-story-eyebrow">{item.eyebrow}</span><h3>{item.heading}</h3><p>{item.copy}</p><Link href={`/vehicles/${item.slug}`} className="jmc-compare-story-link">აღმოაჩინე მოდელი <JmcIcon name="arrow-up-right"/></Link></div>
    </article>;
   })}</div>
  </section>
  <section className="jmc-compare-guidance" aria-labelledby="compare-guide-title"><div><p className="eyebrow">02 / არჩევანის გზამკვლევი</p><h2 id="compare-guide-title">რომელი დეტალია შენთვის მნიშვნელოვანი?</h2></div><div className="jmc-compare-guide-items">
   <p><strong>ტრანსმისია</strong><span>ავტომატური თუ მექანიკური — შეადარე კონკრეტული ვერსიები და აირჩიე მართვის შენთვის სასურველი ტიპი.</span></p>
   <p><strong>ძრავი</strong><span>გაეცანი მოცულობას, საწვავის ტიპსა და სიმძლავრეს იქ, სადაც მონაცემები დადასტურებულია.</span></p>
   <p><strong>აღჭურვილობა</strong><span>მხოლოდ მოდელის სახელით ნუ იხელმძღვანელებ: სხვადასხვა კომპლექტაციას სხვადასხვა მონაცემები შეიძლება ჰქონდეს.</span></p>
  </div></section>
  <div id="compare-workspace" className="jmc-compare-workspace-anchor"><p className="eyebrow">03 / მოდელების შედარება</p><h2>ახლა შეადარე დეტალები</h2><p>აირჩიე ორი ან სამი მოდელი. შეცვალე კომპლექტაცია და ჩართე „მხოლოდ განსხვავებები“, რათა ყურადღება გადაწყვეტილებისთვის მნიშვნელოვან ინფორმაციაზე გადაიტანო.</p></div>
  <VehicleComparison/>
  <section className="jmc-compare-afterword"><div><p className="eyebrow">შემდეგი ნაბიჯი</p><h2>ციფრები მხოლოდ დასაწყისია.</h2><p>შედარებამ შეიძლება პასუხი გაგცეს ტექნიკურ კითხვებზე. საბოლოო არჩევანისთვის კი თითოეული მოდელის ფოტოებს, დეტალურ აღწერასა და კომპლექტაციების თავისებურებებსაც გაეცანი.</p></div><Link href="/vehicles" className="button">აღმოაჩინე ყველა მოდელი <JmcIcon name="arrow-up-right"/></Link></section>
 </main><Footer/></>;
}
