import { page } from '@sb';
import ContactComponent from '../';

export default page({
    title: 'Contact',
    component: ContactComponent,
});

export const Contact = () => <ContactComponent />;