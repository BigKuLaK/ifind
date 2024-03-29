import { useEffect } from "react";
import Aos from "aos";

import { getLanguages, useGlobalData } from "providers/globalDataContext";
import GeneralTemplate from "templates/GeneralTemplate";
import { withComponentName } from "utilities/component";
import VideoPlayer from "components/VideoPlayer";
import Carousel from "components/HomeCarousel";

import { useTranslation } from "translations/index";
import {
  giftSectionButton,
  giftSectionText,
  offersSectionButton,
  offersSectionText,
  prodCompSectionButton,
  prodCompSectionText,
  topButton,
  topText,
  topTitle,
} from "translations/pages/about-us";

const AboutUs = () => {
  const { userLanguage = "en" } = useGlobalData();
  const translate = useTranslation();

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);

  return (
    <GeneralTemplate>
      <div className="about-us">
        <div className="about-us__container">
          <div data-aos="fade-in" className="top">
            <div className="top-container">
              <h1>{translate(topTitle)}</h1>
              <div className="top-content">
                <div className="top-text">
                  <p>{translate(topText)}</p>
                </div>
              </div>
              <a href={"/" + userLanguage + "/about-us"}>
                <button className="about-us-btn">{translate(topButton)}</button>
              </a>
            </div>
            <div className="top-carousel">
              <div className="top-carousel-content">
                <Carousel />
              </div>
            </div>
          </div>
          <div data-aos="zoom-in" className="video">
            <div className="video-content">
              <VideoPlayer />
            </div>
          </div>
          <div data-aos="fade-right" className="offers">
            <div className="offers-banner">
              <a href={"/" + userLanguage + "/offers"}>
                <img
                  src="/offers-banner.jpg"
                  height={350}
                  width={600}
                  alt="banner_offers"
                />
              </a>
            </div>
            <div className="offers-container">
              <div className="offers-content">
                <div className="offers-text">
                  <p>{translate(offersSectionText)}</p>
                </div>
                <a href={"/" + userLanguage + "/offers"}>
                  <button>{translate(offersSectionButton)}</button>
                </a>
              </div>
            </div>
          </div>
          <div data-aos="fade-left" className="prodcomp">
            <div className="prodcomp-container">
              <div className="prodcomp-text">
                <p>{translate(prodCompSectionText)}</p>
              </div>
              <a href={"/" + userLanguage + "/productcomparison"}>
                <button>{translate(prodCompSectionButton)}</button>
              </a>
            </div>
            <div className="prodcomp-banner">
              <a href={"/" + userLanguage + "/productcomparison"}>
                <img
                  src="/prodcomp-banner.jpg"
                  height={350}
                  width={500}
                  alt="banner_product_comparison"
                />
              </a>
            </div>
          </div>
          <div data-aos="fade-right" className="gifts">
            <div className="gifts-banner">
              <a href={"/" + userLanguage + "/gifts"}>
                <img
                  src="/gifts-banner-3.jpg"
                  height={350}
                  width={600}
                  alt="banner_gifts"
                />
              </a>
            </div>
            <div className="gifts-container">
              <div className="gifts-content">
                <div className="gifts-text">
                  <p>{translate(giftSectionText)}</p>
                </div>
                <a href={"/" + userLanguage + "/gifts"}>
                  <button>{translate(giftSectionButton)}</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralTemplate>
  );
};

export const getStaticPaths = async () => {
  const { languages } = await getLanguages();

  // Build [language]/page-name paths
  const pagePaths: {
    params: {
      language: string;
    };
  }[] = [];

  languages.forEach(({ code: language }) => {
    pagePaths.push({
      params: {
        language,
      },
    });
  });

  return {
    paths: pagePaths,
    fallback: "blocking", // false or 'blocking'
  };
};

export const getStaticProps = async () => ({ props: {} });

export default withComponentName("AboutUsPage")(AboutUs);
