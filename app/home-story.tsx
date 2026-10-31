'use client';
import {useState} from 'react';
import Link from 'next/link';

type StoryVehicle={slug:string;name:string;image:string;gallery:string[];description:string};
// Homepage-only approved VIGUS artwork. Original model-page galleries are untouched.
const VIGUS_HOME_ANGLES=[
 '/images/homepage/vigus-front-three-quarter.webp',
 '/images/homepage/vigus-front.webp',
 '/images/homepage/vigus-side.webp',
 '/images/homepage/vigus-rear-three-quarter.webp'
] as const;
const stories=[
 {number:'01',title:'VIGUS',body:'4×4 სისტემა, 2.5-ლიტრიანი დიზელის ძრავა და ავტომატური ან მექანიკური ტრანსმისია.'},
 {number:'02',title:'Grand Avenue',body:'გაეცანი Grand Avenue-ის დიზაინს, აღჭურვილობასა და კომპლექტაციებს.'},
 {number:'03',title:'Grand Avenue PRO',body:'აღმოაჩინე 4×4 პიკაპი, 2.3-ლიტრიანი ძრავითა და 8-საფეხურიანი ავტომატური ტრანსმისიით.'}
];
export default function HomeStory({vehicles}:{vehicles:StoryVehicle[]}){
 const [current,setCurrent]=useState(0);
 const [detail,setDetail]=useState(0);
 const vehicle=vehicles[current]||vehicles[0];
 const photos=(vehicle?.slug==='vigus'
   ? [...VIGUS_HOME_ANGLES,...(vehicle?.gallery||[]).slice(3)]
   : [vehicle?.image,...(vehicle?.gallery||[])]).filter((v):v is string=>Boolean(v));
 const index=detail%Math.max(photos.length,1);
 const image=photos[index];
 const move=(step:number)=>setDetail(x=>(x+step+photos.length)%photos.length);
 return <div className="home3-story">
  <section className="home3-story-intro home3-shell" aria-labelledby="home3-story-title">
   <p className="home3-kicker">02 / ჩვენი მოდელები</p>
   <h2 id="home3-story-title">სამი მოდელი. სამი არჩევანი.</h2>
   <p>ნახე თითოეული მოდელის ხასიათი და გადადი მის დეტალურ გვერდზე.</p>
  </section>
  <section className="home3-story-grid home3-shell" aria-label="აღმოაჩინე JMC">
   {stories.map((story,i)=><article className="home3-story-tile" key={story.number}>
    <div className="home3-story-photo"><img src={vehicles[i]?.slug==='vigus'?VIGUS_HOME_ANGLES[0]:(vehicles[i]?.gallery?.[0]||vehicles[i]?.image)} alt={vehicles[i]?.name+' - ავტომობილის ფოტო'} loading="lazy" decoding="async"/></div>
    <span>{story.number} / 03</span><h3>{story.title}</h3><p>{story.body}</p>
    <Link className="home3-story-link" href={'/vehicles/'+(vehicles[i]?.slug||'vigus')}>მოდელის დეტალები <span aria-hidden="true">↗</span></Link>
   </article>)}
  </section>
  <section className="home3-detail" aria-labelledby="home3-detail-title">
    <div className="home3-shell">
      <div className="home3-heading home3-detail-heading"><div><p className="home3-kicker">03 / ფოტოგალერეა</p><h2 id="home3-detail-title">დაათვალიერე დეტალურად.</h2></div><p>აირჩიე მოდელი და გადახედე მის ფოტოებს.</p></div>
      <div className="home3-model-tabs" role="group" aria-label="გალერეის მოდელი">
       {vehicles.map((v,i)=><button key={v.slug} type="button" className={'home3-tab'+(current===i?' is-active':'')} aria-pressed={current===i} onClick={()=>{setCurrent(i);setDetail(0)}}>{v.name}</button>)}
      </div>
      <div className="home3-detail-stage">
        <div className={'home3-detail-media'+(vehicle.slug==='vigus'&&index<4?' is-studio':'')} onKeyDown={e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}}}>
          {image?<img key={vehicle.slug+'-'+detail} className="home3-gallery-image" src={image} alt={vehicle.name+' - რაკურსი '+(index+1)} loading="lazy" decoding="async"/>:<p>ფოტო მალე დაემატება.</p>}
          {photos.length>1&&<div className="home3-photo-controls"><button type="button" aria-label="წინა ფოტო" onClick={()=>move(-1)}>←</button><span aria-live="polite">{index+1} / {photos.length}</span><button type="button" aria-label="შემდეგი ფოტო" onClick={()=>move(1)}>→</button></div>}
        </div>
        <div className="home3-detail-side"><span className="home3-stage-index">ფოტოგალერეა · {String(index+1).padStart(2,'0')} / {String(photos.length).padStart(2,'0')}</span><h3>{vehicle.name}</h3><p>დაათვალიერე ავტომობილი სხვადასხვა რაკურსიდან. ტექნიკური მონაცემები და კომპლექტაციები მოცემულია მოდელის გვერდზე.</p><Link href={'/vehicles/'+vehicle.slug} className="home3-pill home3-pill-dark">მოდელის დეტალები <span aria-hidden="true">↗</span></Link></div>
      </div>
      {photos.length>1&&<div className="home3-photo-thumbnails" role="group" aria-label="აირჩიე ფოტოს რაკურსი">
        {photos.map((src,i)=><button type="button" key={src+'-'+i} className={'home3-photo-thumb'+(index===i?' is-active':'')+(vehicle.slug==='vigus'&&i<4?' is-studio':'')} aria-label={vehicle.name+' - ფოტო '+(i+1)} aria-pressed={index===i} onClick={()=>setDetail(i)}>
          <img src={src} alt="" loading="lazy" decoding="async"/>
        </button>)}
      </div>}
    </div>
  </section>
  <section className="home3-conversion home3-shell" aria-labelledby="home3-conversion-title">
    <div className="home3-conversion-content"><p className="home3-kicker">04 / ტესტ-დრაივი</p><h2 id="home3-conversion-title">გამოსცადე შენი JMC.</h2><p>შეარჩიე მოდელი და გადადი Test Drive-ის გვერდზე პირობებისა და ხელმისაწვდომობის გასაცნობად.</p><div className="home3-actions"><Link className="home3-pill home3-pill-red" href="/test-drive">დაჯავშნე Test Drive <span aria-hidden="true">↗</span></Link><Link className="home3-pill home3-pill-outline" href="/contact">დაგვიკავშირდი <span aria-hidden="true">↗</span></Link></div></div>
  </section>
 </div>;
}
