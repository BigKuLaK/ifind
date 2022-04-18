import GeneralTemplate from "templates/GeneralTemplate";
import BreadCrumbs from "components/BreadCrumbs";
import ContactForm from "components/ContactForm";
import ContactSidebar from "components/ContactSidebar";

const Contact = () => (
  <GeneralTemplate>
    <BreadCrumbs />

    <section id="contact-us" className="contact-us section">
      <div className="contact-us__container">
        <ContactForm />
        <ContactSidebar />
      </div>
    </section>
  </GeneralTemplate>
);

export default Contact;
