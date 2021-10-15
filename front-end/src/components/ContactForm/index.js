import emailjs from 'emailjs-com';

const ContactForm = () => {

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm("ionos", "template_sjy5hvg", e.target, "user_NZBqX55LWZGHJiJDgGB7r")
            .then((result) => {
                console.log(result.text);
                alert("Your message is Successfully Sent!");
            }, (error) => {
                console.log(error.text);
                alert("There's an error on sending your message!");
            });

        e.target.reset();
    }

    return (
        <div className="col-lg-8 col-12">
            <div className="form-main">
                <div className="title">
                    <h4>Get in touch</h4>
                    <h3>Write us a message</h3>
                </div>
                <form className="form" onSubmit={sendEmail}>
                    <div className="row">
                        <div className="col-lg-6 col-12">
                            <div className="form-group">
                                <label>Your Name<span>*</span></label>
                                <input name="name" type="text" placeholder="" required />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="form-group">
                                <label>Your Subjects<span>*</span></label>
                                <input name="subject" type="text" placeholder="" required />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="form-group">
                                <label>Your Email<span>*</span></label>
                                <input name="email" type="email" placeholder="" required />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="form-group">
                                <label>Your Phone<span>*</span></label>
                                <input name="phone_no" type="text" placeholder="" required />
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group message">
                                <label>Your Message<span>*</span></label>
                                <textarea name="message" placeholder="" required></textarea>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-group button">
                                <button type="submit" className="btn ">Send Message</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default ContactForm;