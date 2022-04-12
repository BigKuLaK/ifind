import { useState, useEffect } from "react";
import { useGlobalData } from "@contexts/globalDataContext";
import CustomLink from "@components/Link";
import PreloadedImage from "@components/PreloadedImage";

import "./styles.module.scss";

const logo = "/images/NewLogowith1Warp_White.png";

const Footer = () => {
  const { footerSetting, socialNetwork, contactInfo }: GlobalContextData = useGlobalData();
  const [informationLinks, setInformationLinks] = useState<FooterLink[]>([]);
  const [footerText, setFooterText] = useState("");
  const [footerFootnote, setFooterFootnote] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialNetworkLink[]>([]);

  useEffect(() => {
    if (footerSetting?.footer_links?.length) {
      setInformationLinks(
        footerSetting.footer_links.map(({ label, page }) => ({
          label,
          path: `/${page.slug}`,
        }))
      );
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
      setSocialLinks(socialNetwork.social_network);
    }
  }, [socialNetwork]);

  return (
    <footer className="footer" id="footer">
      <div className="footer__container">
        <div className="footer-top section">
          <div className="row">
            <div className="footer__about">
              <div className="logo">
                <a href="index.html">
                  <PreloadedImage src={logo} alt="/" />
                </a>
              </div>
              <p className="text">
                {footerText ||
                  `
                    Praesent dapibus, neque id cursus ucibus, tortor neque egestas augue,
                    magna eros eu erat.
                    Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus,
                    metus.
                `}
              </p>

              {contactInfo?.phone_number && (
                <p className="call">
                  Got Question? Call us 24/7
                  <span>
                    <a href={`tel:${contactInfo.phone_number}`}>
                      {contactInfo.phone_number}
                    </a>
                  </span>
                </p>
              )}
            </div>
            <div className="footer__links">
              <h4>Information</h4>
              <ul>
                {informationLinks.map(
                  (infoRoute) =>
                    infoRoute && (
                      <li key={infoRoute.path}>
                        <CustomLink to={infoRoute?.path || "/"}>
                          {infoRoute.label}
                        </CustomLink>
                      </li>
                    )
                )}
              </ul>
            </div>
            <div className="footer__links">
              <h4>Customer Service</h4>
              <ul></ul>
            </div>
            <div className="footer__social">
              <h4>Get In Touch</h4>
              <div className="contact"></div>
              <ul>
                {socialLinks.map(({ url, type }) => (
                  <li key={url}>
                    <a href={url}>
                      <i className={`fa fa-${type}`}></i>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__copyright">
          <div className="inner">
            <div className="row">
              <div className="left">
                <p>
                  Copyright © 2021{" "}
                  <a
                    href="/"
                    aria-label="ifindilu"
                    target="_blank"
                    rel="noreferrer"
                  >
                    iFINDilu
                  </a>{" "}
                  - All Rights Reserved.
                </p>
              </div>
              <div className="right">
                <p>{footerFootnote || ``}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
