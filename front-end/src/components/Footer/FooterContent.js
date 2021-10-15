import { Link } from 'react-router-dom';
import routes, { footerRoutes } from '@config/routes';

const informationLinks = footerRoutes.map(path => routes.find(routeItem => routeItem.path === path));

const FooterContent = ({ logo, text, call, phone, copyright, copyright2, link, affiliate }) => {
    return (

        <footer className="footer" id="footer">
            <div className="footer-top section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 col-md-6 col-12">
                            <div className="single-footer about">
                                <div className="logo">
                                    <a href="index.html"><img src={logo} alt="/" /></a>
                                </div>
                                <p className="text">{text}</p>
                                <p className="call">{call}<span><a className='phone' href="tel:123456789">{phone}</a></span></p>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-12">
                            <div className="single-footer links">
                                <h4>Information</h4>
                                <ul>
                                    {informationLinks.map(infoRoute => (
                                        infoRoute && <li key={infoRoute.path}>
                                            <Link to={infoRoute.path}>{infoRoute.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-2 col-md-6 col-12">
                            <div className="single-footer links">
                                <h4>Customer Service</h4>
                                <ul>

                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12">
                            <div className="single-footer social">
                                <h4>Get In Touch</h4>
                                <div className="contact">
                                    <ul>

                                    </ul>
                                </div>
                                <ul>
                                    <li><a href="/"><i className="ti-facebook"></i></a></li>
                                    <li><a href="/"><i className="ti-twitter"></i></a></li>
                                    <li><a href="/"><i className="ti-flickr"></i></a></li>
                                    <li><a href="/"><i className="ti-instagram"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="copyright">
                <div className="container">
                    <div className="inner">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <div className="left">
                                    <p className='copyright'>{copyright}<a className='link' href="http://www.ifindilu.com" target="_blank" rel="noreferrer">{link}</a>
                                        {copyright2}</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <div className="right">
                                    <p className='affiliate'>{affiliate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    )
};

export default FooterContent;
