'use client';
import {useState} from 'react';
import Link from 'next/link';

type StoryVehicle={slug:string;name:string;image:string;gallery:string[];description:string};
const stories=[
 {number:'02',title:'დიზაინი, რომელიც პირველივე შეხედვით გამოირჩევა.',body:'აღმოაჩინე JMC-ის მოდელების ხასიათი — ექსტერიერის ხაზებიდან ყოველდღიურ პრაქტიკულობამდე.'},
 {number:'03',title:'შეარჩიე შენი შესაძლებლობები.',body:'შეისწავლე თითოეული მოდელი, დაათვალიერე ფოტოები და გაეცანი კომპლექტაციებს.'},
 {number:'04',title:'შენი შემდეგი ნაბიჯი იწყება აქ.',body:'გაეცანი ავტომობილს ახლოდან და დაჯავშნე Test Drive.'}
];
export default function HomeStory({vehicles}:{vehicles:StoryVehicle[]}){
 const [current,setCurrent]=useState(0);
 const [detail,setDetail]=useState(0);
 const vehicle=vehicles[current]||vehicles[0];
 const photos=[vehicle?.image,...(vehicle?.gallery||[])].filter((v):v is string=>Boolean(v));
 const image=photos[detail%Math.max(photos.length,1)];
 return <div className="home3-story">
  <section className="home3-story-intro home3-shell" aria-labelledby="home3-story-title">
   <p className="home3-kicker">02 / DISCOVER MORE</p>
   <h2 id="home3-story-title">მეტი, ვიდრე ერთი შეხედვით ჩანს.</h2>
   <p>გაიცანი JMC-ის მოდელები დეტალურად — დიზაინი, შესაძლებლობები და ყოველდღიური გამოყენება ერთ სივრცეში.</p>
  </section>
  <section className="home3-story-grid home3-shell" aria-label="აღმოაჩინე JMC">
   {stories.map((story,i)=><article className="home3-story-tile" key={story.number}>
    <div className="home3-story-photo"><img src={vehicles[i]?.gallery?.[0]||vehicles[i]?.image} alt={vehicles[i]?.name+' — ავტომობილის ფოტო'} loading="lazy"/></div>
    <span>{story.number} / JMC</span><h3>{story.title}</h3><p>{story.body}</p>
    <Link className="home3-story-link" href={'/vehicles/'+(vehicles[i]?.slug||'vigus')}>გაიცანი მოდელი <span aria-hidden="true">↗</span></Link>
   </article>)}
  </section>
  <section className="home3-detail" aria-labelledby="home3-detail-title">
    <div className="home3-shell">
      <div className="home3-heading home3-detail-heading"><div><p className="home3-kicker">03 / EXPLORE THE DETAILS</p><h2 id="home3-detail-title">აღმოაჩინე ყველა რაკურსი.</h2></div><p>აირჩიე მოდელი და დაათვალიერე მისი არსებული ოფიციალური ფოტოგალერეა.</p></div>
      <div className="home3-model-tabs" role="group" aria-label="გალერეის მოდელი">
       {vehicles.map((v,i)=><button key={v.slug} type="button" className={'home3-tab'+(current===i?' is-active':'')} aria-pressed={current===i} onClick={()=>{setCurrent(i);setDetail(0)}}>{v.name}</button>)}
      </div>
      <div className="home3-detail-stage">
        <div className="home3-detail-media">
          {image?<img key={vehicle.slug+'-'+detail} src={image} alt={vehicle.name+' — რაკურსი '+(detail+1)} loading="lazy"/>:<p>ფოტო მალე დაემატება.</p>}
          {photos.length>1&&<div className="home3-photo-controls"><button type="button" aria-label="წინა ფოტო" onClick={()=>setDetail(x=>(x+photos.length-1)%photos.length)}>←</button><span aria-live="polite">{detail+1} / {photos.length}</span><button type="button" aria-label="შემდეგი ფოტო" onClick={()=>setDetail(x=>(x+1)%photos.length)}>→</button></div>}
        </div>
        <div className="home3-detail-side"><span className="home3-stage-index">JMC / DETAILS</span><h3>{vehicle.name}</h3><p>{vehicle.description}</p><Link href={'/vehicles/'+vehicle.slug} className="home3-pill home3-pill-dark">მოდელის დეტალები <span aria-hidden="true">↗</span></Link></div>
      </div>
    </div>
  </section>
  <section className="home3-conversion home3-shell" aria-labelledby="home3-conversion-title">
    <div className="home3-conversion-content"><p className="home3-kicker">04 / YOUR NEXT MOVE</p><h2 id="home3-conversion-title">გაიცანი JMC ახლოდან.</h2><p>შეარჩიე სასურველი მოდელი და დაჯავშნე Test Drive. ჩვენი გუნდი დაგიკავშირდება დეტალების შესათანხმებლად.</p><div className="home3-actions"><Link className="home3-pill home3-pill-red" href="/test-drive">დაჯავშნე Test Drive <span aria-hidden="true">↗</span></Link><Link className="home3-pill home3-pill-outline" href="/contact">საკონტაქტო ინფორმაცია <span aria-hidden="true">↗</span></Link></div></div>
  </section>
 </div>;
}
