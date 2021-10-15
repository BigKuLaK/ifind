const NewsLetter = () => (
    <section className="shop-newsletter section">
        <div className="container">
            <div className="inner-top">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2 col-12">
                        <div className="inner">
                            <h4 className='title'>Newsletter</h4>
                            <p className='ptext'> Subscribe to our newsletter</p>
                            <form action="mail/mail.php" method="get" target="_blank" className="newsletter-inner">
                                <input name="EMAIL" placeholder="Your email address" required="" type="email" />
                                <button className="btn">Subscribe</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default NewsLetter;