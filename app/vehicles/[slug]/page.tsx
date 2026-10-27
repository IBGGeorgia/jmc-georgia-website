import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import {getVehicle,vehicles,categoryLabels} from '../../../lib/vehicles';
import {TrimComparison} from './trim-comparison';

export function generateStaticParams(){return vehicles.map(v=>({slug:v.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const v=getVehicle(slug);return {title:v?v.name:'მოდელი ვერ მოიძებნა',description:v?.description};
}
const images=[
 {src:'/images/vigus/hero.webp',title:'ექსტერიერი',label:'VIGUS — წინა სამი მეოთხედის რაკურსი'},
 {src:'/images/vigus/front.webp',title:'წინა ხედი',label:'VIGUS — წინა ხედი'},
 {src:'/images/vigus/side.webp',title:'პროფილი',label:'VIGUS — გვერდითი ხედი'},
 {src:'/images/vigus/rear.webp',title:'უკანა ხედი',label:'VIGUS — უკანა ხედი'},
 {src:'/images/vigus/cockpit.webp',title:'სალონი',label:'VIGUS — სალონის საერთო ხედი'},
 {src:'/images/vigus/seats.webp',title:'სავარძლები',label:'VIGUS — წინა სავარძლები'}
];
export default async function VehiclePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const v=getVehicle(slug);if(!v)notFound();
 const isVigus=slug==='vigus';
 return <><Header/><main>
 <section className="model-hero"><div className="container model-hero-layout"><div className="model-hero-copy">
 <p className="eyebrow">JMC GEORGIA / {categoryLabels[v.category]}</p>
 <h1>{v.name}</h1><p>{v.description}</p>
 <div className="actions"><Link href="/test-drive" className="button">ტესტ-დრაივი ↗</Link><a href="#trims" className="button outline">კომპლექტაციების შედარება ↓</a></div>
 </div>{isVigus&&<div className="model-image-frame"><img src="/images/vigus/hero.webp" alt="JMC VIGUS — წინა სამი მეოთხედის რაკურსი" /></div>}</div></section>
 {isVigus&&<><section className="container section" id="gallery">
 <div className="section-head"><div><p className="eyebrow">დეტალებში</p><h2>აღმოაჩინე VIGUS</h2></div></div>
 <div className="model-gallery">{images.slice(1).map((im,i)=><figure className={i===3?'model-gallery-wide':''} key={im.src}><img src={im.src} alt={im.label} loading="lazy"/><figcaption>{im.title}</figcaption></figure>)}</div></section>
 <section className="section soft"><div className="container model-spec-highlights">
 <div><p className="eyebrow">ტექნიკური მონაცემები</p><h2>შექმნილი ყოველდღიური ამოცანებისთვის</h2></div>
 <div className="model-highlight-grid"><div><strong>2.5 L</strong><span>დიზელის ძრავა</span></div><div><strong>167 hp</strong><span>სიმძლავრე</span></div><div><strong>4×4</strong><span>ამძრავი</span></div><div><strong>210 mm</strong><span>კლირენსი</span></div></div>
 </div></section></>}
 <section id="trims" className="container section"><p className="eyebrow">VIGUS / კომპლექტაციები</p><h2>შეადარე კომპლექტაციები</h2>
 <p className="muted">მახასიათებლები აღებულია JMC Georgia-სთვის მოწოდებული 2026 წლის ბროშურის მონაცემებიდან. ფასები დაზუსტდება.</p>
 <TrimComparison trims={v.trims}/></section>
 <section className="container section catalogue-contact"><div className="action-banner"><div><p className="eyebrow light">JMC GEORGIA</p><h2>გაინტერესებს {v.name}?</h2><p>დაგვიკავშირდი კომპლექტაციისა და ხელმისაწვდომობის შესახებ.</p></div><Link className="button" href="/contact">კონტაქტი ↗</Link></div></section>
 </main><Footer/></>;
}
