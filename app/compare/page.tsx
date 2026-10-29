import type {Metadata} from 'next';
import {Header,Footer} from '../site-components';
import {VehicleComparison} from './vehicle-comparison';
import './compare.css';
export const metadata:Metadata={title:'მოდელების შედარება',description:'შეადარე JMC Vigus, Grand Avenue და Grand Avenue PRO-ის დადასტურებული ტექნიკური მონაცემები და კომპლექტაციები.'};
export default function ComparePage(){return <><Header/><main className="container jmc-compare-page"><header className="page-head jmc-page-intro"><p className="eyebrow">JMC Georgia / Compare</p><h1>შეადარე მოდელები</h1><p className="jmc-page-lead">აირჩიე ორი ან სამი ავტომობილი და შეადარე კომპლექტაციები, ძრავები და აღჭურვილობა ერთ სივრცეში.</p></header><VehicleComparison/></main><Footer/></>;}
