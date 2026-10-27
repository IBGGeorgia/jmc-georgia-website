import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import Link from 'next/link';
import {Header,Footer} from '../../site-components';
import {getVehicle,vehicles,categoryLabels} from '../../../lib/vehicles';
import {TrimComparison} from './trim-comparison';
export function generateStaticParams(){return vehicles.map(v=>({slug:v.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const v=getVehicle(slug);return {title:v?v.name:'მოდელი ვერ მოიძებნა'};}
export default async function VehiclePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const v=getVehicle(slug);if(!v)notFound();return <><Header/><main><section className="catalogue-page-head"><div className="container"><p className="eyebrow">JMC GEORGIA / {categoryLabels[v.category]}</p><h1>{v.name}</h1><p>{v.description}</p><div className="actions"><Link className="button" href="/test-drive">ტესტ-დრაივი ↗</Link><Link className="button outline" href="/contact">ინფორმაციის მოთხოვნა</Link></div></div></section><section className="container section"><h2>კომპლექტაციების შედარება</h2><TrimComparison trims={v.trims}/></section></main><Footer/></>}