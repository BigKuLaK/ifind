import { page } from '@sb';
import HomeComponent from '../';

export default page({
    title: 'Home',
    component: HomeComponent,
});

export const Home = () => <HomeComponent />;