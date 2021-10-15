import GeneralTemplate from '@templates/GeneralTemplate';
import BreadCrumbs from '@components/BreadCrumbs';
import ContactForm from '@components/ContactForm';
import ContactSidebar from '@components/ContactSidebar';
import { withComponentName } from '@utilities/component';

const Contact = () => (
    <GeneralTemplate>
        <BreadCrumbs />

        <section id="contact-us" className="contact-us section">
            <div className="container">
                <div className="contact-head">
                    <div className="row">
                        <ContactForm />
                        <ContactSidebar />
                    </div>
                </div>
            </div>
        </section>
    </GeneralTemplate>
);

export default withComponentName('ContactPage')(Contact);