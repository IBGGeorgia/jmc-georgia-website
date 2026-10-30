import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../site-components';
import {isPrivacyPolicyPublished,privacyPublicationMetadata} from '../../lib/privacy-policy';

export const dynamic='force-dynamic';
export const metadata:Metadata={
 title:'კონფიდენციალურობის პოლიტიკა',
 description:'JMC Georgia — კონფიდენციალურობა, Test Drive-ის მონაცემების დამუშავება და თქვენი უფლებები.'
};

function PolicyHolding(){
 return <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-status-title">
  <div className="jmc-info-panel-copy">
   <p className="jmc-info-eyebrow">დოკუმენტის სტატუსი</p>
   <h2 id="privacy-status-title">პოლიტიკა მზადდება</h2>
   <p><strong>მონაცემთა დამუშავებისთვის პასუხისმგებელი იურიდიული პირი:</strong> შპს „იბერია ბიზნეს ჯგუფი“</p>
   <p><strong>საიდენტიფიკაციო კოდი:</strong> 204975376</p>
   <p>საიტის კონფიდენციალურობის ოფიციალური პოლიტიკის საბოლოო იურიდიული და ტექნიკური დამტკიცება მიმდინარეობს. ტესტ-დრაივის ონლაინ განაცხადები ამ ეტაპზე არ მიიღება.</p>
   <p>პერსონალურ მონაცემებთან დაკავშირებული მოთხოვნებისა და მარკეტინგულ კომუნიკაციაზე უარის საკითხებზე დაგვიკავშირდი: <a href="mailto:compliance@ibg.ge">compliance@ibg.ge</a>.</p>
   <p>პოლიტიკის სრული ტექსტი გამოქვეყნდება მონაცემების შეგროვების ფუნქციის გააქტიურებამდე.</p>
   <div className="jmc-info-actions">
    <Link href="/" className="button">მთავარ გვერდზე დაბრუნება <span aria-hidden="true">↗</span></Link>
   </div>
  </div>
 </section>;
}

/** Public-facing wording ONLY. Internal review notes stay in docs and GitHub. */
function ApprovedPolicy(){
 const {version,effectiveDate}=privacyPublicationMetadata();
 return <div className="jmc-privacy-approved">
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-intro">
   <div className="jmc-info-panel-copy">
    <p className="jmc-info-eyebrow">JMC Georgia / მონაცემთა დაცვა</p>
    <h2 id="privacy-intro">თქვენი მონაცემების დამუშავების პირობები</h2>
    <p>ვერსია: <strong>{version}</strong> · ძალაში შესვლის თარიღი: <strong>{effectiveDate}</strong></p>
    <p>ეს პოლიტიკა განმარტავს JMC Georgia-ს ვებგვერდზე Test Drive-ის მოთხოვნისა და საიტის გამოყენებისას პერსონალური მონაცემების დამუშავებას.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-controller">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-controller">01 / ვინ არის პასუხისმგებელი?</h2>
    <p>მონაცემთა დამუშავებისთვის პასუხისმგებელი პირია <strong>შპს „იბერია ბიზნეს ჯგუფი“</strong>, საიდენტიფიკაციო კოდი <strong>204975376</strong>.</p>
    <p>საკონტაქტო მისამართი: თბილისი, ბელიაშვილის ქ. 115. მონაცემთა დაცვის საკითხებზე: <a href="mailto:compliance@ibg.ge">compliance@ibg.ge</a>.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-data">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-data">02 / რა მონაცემებს ვამუშავებთ?</h2>
    <p>Test Drive-ის მოთხოვნისას: სახელი და გვარი, მობილური ნომერი, არჩეული მოდელი, სურვილის შემთხვევაში თარიღი, მოთხოვნის დრო, წყარო და სარეკლამო კამპანიის პარამეტრები, განაცხადის სტატუსი, მომსახურებისთვის აუცილებელი შენიშვნები და თანხმობის ჩანაწერები.</p>
    <p>უსაფრთხოებისა და სპამის პრევენციისთვის გამოიყენება IP მისამართის კრიპტოგრაფიული ანაბეჭდი. ტექნიკურ ჟურნალებში IP მისამართი შეიძლება დროებით დამუშავდეს. ონლაინ ფორმა არ ითხოვს პირად ნომერს, პირადობისა თუ მართვის მოწმობის ასლს ან საბანკო ბარათის მონაცემებს.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-purpose">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-purpose">03 / მიზანი და სამართლებრივი საფუძველი</h2>
    <p>თქვენს მონაცემებს ვიყენებთ მოთხოვნის მისაღებად, ავტომობილისა და სასურველი თარიღის დასაზუსტებლად, თქვენთან დასაკავშირებლად და საცდელი მართვის შესათანხმებლად. ამის საფუძველია თქვენი მოთხოვნით მომსახურების მომზადებისთვის საჭირო დამუშავება და საქართველოს კანონმდებლობით გათვალისწინებული შესაბამისი საფუძვლები.</p>
    <p>სისტემის უსაფრთხოებისა და უკანონო წვდომის აღკვეთისთვის მონაცემები მუშავდება სათანადო სამართლებრივი საფუძვლის არსებობისას. მარკეტინგული კომუნიკაცია ეფუძნება მხოლოდ ცალკე, არასავალდებულო თანხმობას; მისი არარსებობა Test Drive-ის მოთხოვნაზე არ მოქმედებს.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-marketing">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-marketing">04 / მარკეტინგული თანხმობის გამოხმობა</h2>
    <p>შეგიძლიათ ნებისმიერ დროს უფასოდ მოითხოვოთ პირდაპირი მარკეტინგის შეწყვეტა წერილით <a href="mailto:compliance@ibg.ge">compliance@ibg.ge</a> მისამართზე ან შესაბამისი კომუნიკაციისას მითითებული უარის თქმის საშუალებით.</p>
    <p>მოთხოვნის მიღების შემდეგ პირდაპირი მარკეტინგის მიზნით დამუშავება შეწყდება გონივრულ ვადაში, არაუგვიანეს 7 სამუშაო დღისა. თანხმობის გამოხმობა არ აუქმებს უკვე შემოსულ Test Drive-ის მომსახურების მოთხოვნას.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-partners">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-partners">05 / ვის შეუძლია მონაცემებზე წვდომა?</h2>
    <p>მონაცემებზე წვდომა აქვთ მხოლოდ უფლებამოსილ ადმინისტრატორებსა და გაყიდვების თანამშრომლებს მათი მოვალეობების ფარგლებში. ვებგვერდი და PostgreSQL მონაცემთა ბაზა განთავსებულია Render-ის Frankfurt, Germany რეგიონში; ჰოსტინგის მომწოდებელი ტექნიკურ მონაცემებს ამუშავებს მომსახურების გაწევის ფარგლებში.</p>
    <p>საერთაშორისო გადაცემა, ასეთის არსებობისას, განხორციელდება მხოლოდ შესაბამისი სამართლებრივი საფუძვლით და აუცილებელი გარანტიებით. Zoho CRM-ის ინტეგრაცია ამჟამად დაგეგმილია და მისი გააქტიურების შემთხვევაში პოლიტიკა განახლდება.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-retention">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-retention">06 / რამდენ ხანს ინახება მონაცემები?</h2>
    <p>Test Drive-ის განაცხადები და მათთან დაკავშირებული სამუშაო ჩანაწერები ინახება არაუმეტეს <strong>12 თვისა</strong> ბოლო არსებითი განახლებიდან ან სტატუსის ცვლილებიდან, გარდა იმ შემთხვევისა, როდესაც უფრო ხანგრძლივი შენახვა აუცილებელია კანონით დადგენილი მოვალეობის ან სამართლებრივი მოთხოვნის დასაცავად.</p>
    <p>ვადის ამოწურვის შემდეგ ჩანაწერები იშლება მოქმედი შენახვის წესის შესაბამისად. მარკეტინგული თანხმობისა და მისი გამოხმობის მტკიცებულება შეიძლება შეინახოს კანონით განსაზღვრული ვადით. სარეზერვო ასლებზე მოქმედებს მომწოდებლის უსაფრთხოების და აღდგენის ცალკე წესები.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-security">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-security">07 / მონაცემების დაცვა</h2>
    <p>გამოიყენება ინდივიდუალური ავტორიზაცია, როლებზე დაფუძნებული წვდომა, ფორმის ვალიდაცია, არასანქცირებული მოთხოვნების შეზღუდვა და ადმინისტრაციული ცვლილებების აღრიცხვა. უსაფრთხოების ზომები პერიოდულად გადაიხედება.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-rights">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-rights">08 / თქვენი უფლებები</h2>
    <p>საქართველოს კანონმდებლობით გათვალისწინებულ ფარგლებში შეგიძლიათ მოითხოვოთ დამუშავების შესახებ ინფორმაცია, მონაცემებზე წვდომა და ასლი, გასწორება, განახლება, დაბლოკვა, წაშლა ან გადატანა, ასევე შესაბამის შემთხვევებში თანხმობის გამოხმობა და საჩივრის შეტანა.</p>
    <p>მოთხოვნისთვის დაგვიკავშირდით: <a href="mailto:compliance@ibg.ge">compliance@ibg.ge</a>. თქვენი მონაცემების გამჟღავნების თავიდან ასაცილებლად, პასუხამდე შეიძლება დაგვჭირდეს მოთხოვნის ავტორის ვინაობის შემოწმება.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-cookies">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-cookies">09 / ტექნიკური ფაილები და ანალიტიკა</h2>
    <p>ადმინისტრაციული პანელის ავტორიზაციისთვის გამოიყენება აუცილებელი სესიის cookie. საიტზე გამოყენებულ გარე ტექნიკურ რესურსებს შეიძლება გადაეცეთ სტანდარტული ქსელური მონაცემები. დამატებითი ანალიტიკური ან სარეკლამო ტექნოლოგიების გამოყენების შემთხვევაში მათი შესაბამისი მიზნები და საჭირო თანხმობები განისაზღვრება მოქმედი კანონმდებლობით.</p>
   </div>
  </section>
  <section className="jmc-info-panel jmc-privacy-panel" aria-labelledby="privacy-changes">
   <div className="jmc-info-panel-copy">
    <h2 id="privacy-changes">10 / პოლიტიკის ცვლილებები</h2>
    <p>პოლიტიკის განახლებისას გამოქვეყნდება ახალი ვერსია და ძალაში შესვლის თარიღი. არსებითი ცვლილებების შესახებ ინფორმაცია მოგეწოდებათ კანონით აუცილებელ შემთხვევებში.</p>
    <div className="jmc-info-actions"><Link href="/test-drive" className="button">Test Drive-ზე დაბრუნება <span aria-hidden="true">↗</span></Link></div>
   </div>
  </section>
 </div>;
}
export default function Privacy(){
 const published=isPrivacyPolicyPublished();
 return <>
  <Header/>
  <main className="container jmc-info-page jmc-privacy-page">
   <header className="page-head jmc-page-intro">
    <p className="eyebrow">JMC Georgia</p>
    <h1>კონფიდენციალურობა</h1>
    <p className="jmc-page-lead">{published?'ჩვენი პოლიტიკა პერსონალური მონაცემების დამუშავებისა და დაცვის შესახებ.':'ინფორმაცია კონფიდენციალურობის პოლიტიკის შესახებ.'}</p>
   </header>
   {published?<ApprovedPolicy/>:<PolicyHolding/>}
  </main>
  <Footer/>
 </>;
}
