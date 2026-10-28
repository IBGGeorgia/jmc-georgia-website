import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {getVehicle,vehicles} from '../../../lib/vehicles';
import {VigusPage} from './vigus-page';
import {GenericModelPage} from './generic-model-page';
import {BrochureModelPage} from './brochure-model-page';
import {GrandAvenueProDraftPage} from './grand-avenue-pro-draft-page';
import {grandAvenueTechnical,grandAvenueEquipment,grandAvenueMedia,grandAvenueHighlights} from '../../../lib/grand-avenue';
import './model-page.css';
import './brochure-model.css';

export function generateStaticParams(){return vehicles.map(vehicle=>({slug:vehicle.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const vehicle=getVehicle(slug);
 return {
  title:vehicle?`JMC ${vehicle.name}`:'მოდელი ვერ მოიძებნა',
  description:vehicle?.description
 };
}

/** Routing only: no new model content is invented or silently copied from Vigus. */
export default async function VehiclePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const vehicle=getVehicle(slug);
 if(!vehicle)notFound();
 if(slug==='grand-avenue-pro')return <GrandAvenueProDraftPage/>;
 if(slug==='vigus')return <VigusPage vehicle={vehicle}/>;
 if(slug==='grand-avenue')return <BrochureModelPage
  vehicle={vehicle} intro="შექმნილი რეალური გზებისთვის."
  technical={grandAvenueTechnical} highlights={grandAvenueHighlights}
  equipment={grandAvenueEquipment} media={grandAvenueMedia}/>;
 return <GenericModelPage vehicle={vehicle}/>;
}
