import {grandAvenue} from './grand-avenue';
export type Feature={label:string;value:string};
export type Trim={id:string;name:string;priceGEL?:number;powertrain?:string;drivetrain?:string;transmission?:string;features:Feature[]};
export type Vehicle={slug:string;name:string;category:'pickup'|'suv'|'commercial'|'other';publicationStatus:'approved'|'draft';description:string;heroImage?:string;gallery:string[];trims:Trim[];highlighted?:boolean};
const vigusSpecs:Feature[]=[
{label:'სიმძლავრე',value:'167 hp'},{label:'აჩქარება',value:'14,7 წმ'},
{label:'კლირენსი',value:'210 mm'},{label:'საწვავის ავზი',value:'75 L'},
{label:'სიგრძე',value:'5335 mm'},{label:'სიგანე',value:'1882 mm'},
{label:'სიმაღლე',value:'1834 mm'},{label:'თვლების ბაზა',value:'3150 mm'},
{label:'სატვირთო ძარის ზომები',value:'1545 × 1595 × 545 mm'},
{label:'ეკოლოგიური სტანდარტი',value:'Euro 5'}
];
const catalogue:Vehicle[]=[{
 slug:'vigus',name:'VIGUS',category:'pickup',publicationStatus:'approved',highlighted:true,
 description:'JMC VIGUS — ოთხივე წამყვანი თვლით აღჭურვილი პიკაპი, 2.5-ლიტრიანი დიზელის ძრავით. ხელმისაწვდომია ავტომატური და მექანიკური ტრანსმისიის კომპლექტაციებით.',
 heroImage:'/images/vigus/hero.webp',gallery:['/images/vigus/front.webp','/images/vigus/side.webp','/images/vigus/rear.webp','/images/vigus/cockpit.webp','/images/vigus/seats.webp'],
 trims:[
 {id:'vigus-at',name:'4X4 AT GL',powertrain:'2.5 L Diesel · 167 hp',drivetrain:'4×4',transmission:'8AT',features:[...vigusSpecs,{label:'დისკები და საბურავები',value:'17″ · 245/70 R17'}]},
 {id:'vigus-mt',name:'4X4 MT GL',powertrain:'2.5 L Diesel · 167 hp',drivetrain:'4×4',transmission:'6MT',features:[...vigusSpecs,{label:'დისკები და საბურავები',value:'17″ · 245/70 R17'}]}
 ]
},grandAvenue];
/** Only explicitly approved models are exposed to routing, catalogue and metadata. */
export const vehicles:Vehicle[]=catalogue.filter(vehicle=>vehicle.publicationStatus==='approved');
export const getVehicle=(slug:string)=>vehicles.find(v=>v.slug===slug);
export const categoryLabels:Record<Vehicle['category'],string>={pickup:'პიკაპი',suv:'SUV',commercial:'კომერციული',other:'სხვა'};
