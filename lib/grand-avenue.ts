import type {Vehicle,Feature} from './vehicles';

/**
 * Grand Avenue 4X4 AT GL (Diesel) — transcribed from user-provided
 * "JMC_Brochure_Studio_2026_Final(2).html", model-data JSON, id: avenue_gl.
 * Source fields are versioned by the 2026 brochure; no international data.
 * The PRO LX/SLX petrol/diesel entries are a DIFFERENT future model.
 */
export const grandAvenueMedia:{
 hero?:string;exterior?:string;interior?:string;capability?:string;
 safety?:string;front?:string;side?:string;rear?:string;detail?:string;
}={}; // Awaiting the user's original, approved Grand Avenue photographs.

export const grandAvenueTechnical:Feature[]=[
 {label:'ძრავი',value:'2.5 ლ · დიზელი · 4×4'},
 {label:'სიმძლავრე',value:'211 ც.ძ.'},
 {label:'ტრანსმისია',value:'8-საფეხურიანი ავტომატური (8AT)'},
 {label:'აჩქარება 0–100 კმ/სთ',value:'12.03 წმ'},
 {label:'კლირენსი',value:'235 მმ'},
 {label:'უკანა დიფერენციალი',value:'ბლოკირების ფუნქცია'},
 {label:'დაუტვირთავი მასა',value:'2095 კგ'},
 {label:'სრული მასა',value:'3145 კგ'},
 {label:'საწვავის ავზი',value:'80 ლ'},
 {label:'ემისიის სტანდარტი',value:'Euro 5'},
 {label:'სიგრძე',value:'5435 მმ'},
 {label:'სიგანე',value:'1935 მმ'},
 {label:'სიმაღლე',value:'1890 მმ'},
 {label:'სატვირთო ძარის სიგრძე',value:'1545 მმ'},
 {label:'სატვირთო ძარის სიგანე',value:'1595 მმ'},
 {label:'სატვირთო ძარის სიმაღლე',value:'545 მმ'},
 {label:'თვლების ბაზა',value:'3270 მმ'},
 {label:'დისკები და საბურავები',value:'17″ · 265/65 R17'}
];
// Brochure contains no consumption figure and no confirmed selling price or warranty.
// Those fields must NOT appear as numeric claims on the website.

export const grandAvenueEquipment={
 exterior:[
  'LED დღის ფარები და ავტომატურად მართვადი წინა ფარები',
  'გვერდითი სარკეების LED მოხვევის მაჩვენებლები',
  'წინა და უკანა სანისლე ფარები',
  'გვერდითი საფეხურები და სატვირთო ძარის ტელესკოპური საფეხური',
  'წვიმის სენსორი',
  'სატვირთო ძარის განათება',
  'ელექტრორეგულირებადი გვერდითი სარკეები'
 ],
 interior:[
  'ჭკვიანი გასაღები და ღილაკით დაქოქვა',
  'Bluetooth და რადიო',
  '12.8″ სენსორული მულტიმედიური დისპლეი',
  'Apple CarPlay და Android Auto · 6 დინამიკი',
  'USB დამტენი პორტები წინა და უკანა რიგში',
  '12V კვების პორტები წინა და უკანა რიგში',
  'კონდიცირების სისტემა ჰაერის ფილტრაციით',
  '3.5″ ციფრული ინსტრუმენტების პანელი',
  'რეგულირებადი მულტიფუნქციური საჭე, სიჩქარის გადამრთველი ბერკეტებით',
  'ელექტრონული პარკირების მუხრუჭი და Auto Hold',
  'ელექტროშუშები წინა და უკანა რიგში',
  'ფანჯრების დისტანციური აწევის ფუნქცია',
  'უკანა მინის დაორთქვლის საწინააღმდეგო სისტემა',
  'შავი და რუხი ინტერიერის დეტალები',
  'ტყავის სავარძლები',
  'მძღოლის სავარძლის ელექტრორეგულირება 6 მიმართულებით',
  'წინა მგზავრის სავარძლის ელექტრორეგულირება 4 მიმართულებით',
  'დასაკეცი უკანა სავარძლები'
 ],
 safety:[
  'კრუიზ-კონტროლი',
  'შეჯახებისას კარების ავტომატური განბლოკვა',
  'დაბლოკვის საწინააღმდეგო სამუხრუჭე სისტემა (ABS)',
  'სამუხრუჭე ძალის ელექტრონული განაწილება (EBD)',
  'სტაბილურობის ელექტრონული კონტროლი (ESC)',
  'აღმართზე დაძვრის ასისტენტი (HLA)',
  'დაღმართზე დაშვების ასისტენტი (HDC)',
  'წინა და უკანა პარკირების სენსორები',
  'უკანა ხედვის კამერა',
  'საბურავების წნევის მონიტორინგი (TPMS)',
  'მძღოლისა და წინა მგზავრის უსაფრთხოების ბალიშები',
  'გვერდითი ფარდა-ბალიშები',
  'ISOFIX სამაგრები',
  'სამწერტილიანი უსაფრთხოების ღვედები',
  'ცენტრალური საკეტი და სატვირთო ძარის საკეტი',
  'ავტომობილის პოვნის ფუნქცია',
  'ავტომატური ჩაკეტვა 15 კმ/სთ სიჩქარეზე',
  'იმობილაიზერი და ქურდობის საწინააღმდეგო სისტემა',
  'ბავშვთა უსაფრთხოების საკეტი',
  'სატვირთო ძარის მოძრავი საფარი და სალონის ხალიჩები'
 ],
 capability:[
  '4×4 სრული ამძრავი',
  'უკანა დიფერენციალის ბლოკირება',
  'აღმართზე დაძვრის ასისტენტი (HLA)',
  'დაღმართზე დაშვების ასისტენტი (HDC)',
  'გვერდითი და სატვირთო ძარის ტელესკოპური საფეხურები',
  'სატვირთო ძარის განათება'
 ]
} as const;

export const grandAvenueHighlights=[
 {label:'ექსტერიერი',title:'დეტალები პრაქტიკული დანიშნულებით.',body:'LED განათება, წვიმის სენსორი, გვერდითი საფეხურები და სატვირთო ძარის განათება ყოველდღიურ გამოყენებას ამარტივებს.',media:'exterior' as const},
 {label:'ინტერიერი',title:'კომფორტი და ციფრული ფუნქციები.',body:'12.8-დუიმიანი სენსორული ეკრანი, Apple CarPlay და Android Auto, ექვსი დინამიკი და ელექტრორეგულირებადი სავარძლები.',media:'interior' as const},
 {label:'უსაფრთხოება',title:'დამხმარე სისტემები ყოველ გზაზე.',body:'ESC, ABS, HLA და HDC, წინა და უკანა პარკირების სენსორები და უკანა ხედვის კამერა.',media:'safety' as const},
 {label:'შესაძლებლობები',title:'4×4. მზად განსხვავებული გზებისთვის.',body:'უკანა დიფერენციალის ბლოკირება, 235 მმ კლირენსი და 8-საფეხურიანი ავტომატური ტრანსმისია.',media:'capability' as const}
] as const;

export const grandAvenue:Vehicle={
 slug:'grand-avenue',
 name:'GRAND AVENUE',
 category:'pickup',
 publicationStatus:'draft',
 description:'JMC Grand Avenue — 4×4 პიკაპი 2.5-ლიტრიანი დიზელის ძრავით, 211 ც.ძ. სიმძლავრითა და 8-საფეხურიანი ავტომატური ტრანსმისიით.',
 // Intentionally no heroImage/gallery until the user's model-correct photographs arrive.
 gallery:[],
 trims:[{
  id:'grand-avenue-4x4-at-gl',
  name:'4X4 AT GL · Diesel',
  powertrain:'2.5 ლ · დიზელი · 211 ც.ძ.',
  drivetrain:'4×4',
  transmission:'8AT',
  features:grandAvenueTechnical
 }]
};
