import HomeExperience from './home-experience';
import HomeStory from './home-story';
import {studioImageFor} from '../lib/studio-images';
import { Header, Footer } from './site-components';
import {vehicles} from '../lib/vehicles';
import './home-experience.css';

export default function Home() {
  return <><Header /><main>
    <HomeExperience items={vehicles.map(model=>({slug:model.slug,name:model.name,image:studioImageFor(model.slug,model.heroImage),description:model.description}))}/>

    <HomeStory vehicles={vehicles.map(model=>({slug:model.slug,name:model.name,image:studioImageFor(model.slug,model.heroImage),gallery:model.gallery,description:model.description}))}/>
  </main><Footer/></>;
}
