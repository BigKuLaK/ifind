import { component } from '@sb';
import ContactSidebarComponent from '../';

export default component({
    title: 'Contact Sidebar',
    component: ContactSidebarComponent,
});

export const ContactSidebar = () => (
    <div className="contact-us">
        <ContactSidebarComponent />
    </div>
)