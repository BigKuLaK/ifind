import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGlobalData } from '@contexts/globalDataContext';

import routes, { footerRoutes } from '@config/routes';

const mockInfoLinks = routes.filter(route => footerRoutes.includes(route.path));
const logo = '/images/NewLogowith1Warp_White.png';


const Footer = () => {
    const { footerSetting, socialNetwork, contactInfo } = useGlobalData();
    const [informationLinks, setInformationLinks] = useState(mockInfoLinks);
    const [footerText, setFooterText] = useState('');
    const [footerFootnote, setFooterFootnote] = useState('');
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        if (footerSetting?.footer_links?.length) {

            setInformationLinks(footerSetting.footer_links.map(({ label, page }) => ({
                label,
                path: `/${page.slug}`
            })));
        }

        if (footerSetting?.footer_text) {
            setFooterText(footerSetting.footer_text);
        }
        if (footerSetting?.footer_footnote) {
            setFooterFootnote(footerSetting.footer_footnote);
        }
    }, [footerSetting]);

    useEffect(() => {
        if (socialNetwork?.social_network?.length) {
            setSocialLinks(socialNetwork.social_network.map(({ type, url }) => ({ type, url })));
        }
    }, [socialNetwork]);


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
                                <p className="text">
                                    {


                                        footerText || `

                                        Praesent dapibus, neque id cursus ucibus, tortor neque egestas augue,
                                        magna eros eu erat.
                                        Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus,
                                        metus.
                                    `

                                    }</p>

                                {
                                    contactInfo?.phone_number && (
                                        <p className="call">
                                            Got Question? Call us 24/7
                                            <span><a href={`tel:${contactInfo.phone_number}`}>{contactInfo.phone_number}</a></span>
                                        </p>
                                    )
                                }
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
                                <div className="contact"></div>
                                <ul>
                                    {socialLinks.map(({ url, type }) => (
                                        <li key={url}><a href={url}><i className={`ti-${type}`}></i></a></li>
                                    ))}
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
                                    <p>Copyright © 2021 <a href="/" target="_blank" rel="noreferrer">iFINDilu</a> -
                                        All Rights Reserved.
                                    </p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <div className="right">
                                    <p>
                                        {
                                            footerFootnote || `
                                            *Diese Seite verwendet Affiliate-Links. 
                                            Wir erhalten bei einem Kauf eine kleine Provision. 
                                            Als Amazon-Partner und Co. verdienen wir an qualifizierten Verkäufen.
                                            Vielen Dank für Eure Unterstützung! `
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
};

export default Footer;
