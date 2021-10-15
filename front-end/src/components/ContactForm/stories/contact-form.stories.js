import { component } from '@sb';
import ContactFormComponent from '../';

export default component({
    title: 'Contact Form',
    component: ContactFormComponent,
});

export const ContactForm = () => (
    <div className="contact-us">
        <ContactFormComponent />
    </div>
)