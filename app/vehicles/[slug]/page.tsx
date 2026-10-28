import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {getVehicle,vehicles} from '../../../lib/vehicles';
import {VigusPage} from './vigus-page';
import {GenericModelPage} from './generic-model-page';
import './model-page.css';

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
 return slug==='vigus'?<VigusPage vehicle={vehicle}/>:<GenericModelPage vehicle={vehicle}/>;
}
