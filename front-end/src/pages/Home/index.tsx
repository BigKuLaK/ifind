//import { useEffect, useRef } from "react";
import VideoPlayer from "@components/VideoPlayer";
import GeneralTemplate from "@templates/GeneralTemplate";
import { withComponentName } from '@utilities/component';
import Carousel from '../../components/HomeCarousel';
//import { useLanguages } from "@contexts/languagesContext";
import "./home.scss";

const Home = () => {
  // const {
  //   languages = [],
  //   userLanguage = "en",
  //   replaceLanguage,
  // } = useLanguages();

  return (
    <GeneralTemplate>
      <div className="home">
        <div className="container">
          <div className="top">
            <div className="top-container">
              <h1>WELCOME TO IFINDILU</h1>
              <div className="top-content">
                <p>"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
                <p>"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>

                <button><a href="">SEE MORE...</a></button>
              </div>
            </div>
            <div className="top-carousel">
              <div className="top-carousel-content">
                <Carousel />
              </div>
            </div>
          </div>
          <div className="video">
            <div className="video-content">
              <VideoPlayer />
            </div>
          </div>
          <div className="offers">
            <div className="offers-banner">
              <img src="/offers-banner.jpg" height={350} width={600} alt="banner_offers" />
            </div>
            <div className="offers-container">
              <div className="offers-content">
                <div className="offers-text">
                  <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
                </div>
                <button><a href="">SHOP NOW</a></button>
              </div>
            </div>
          </div>
          <div className="prodcomp">
            <div className="prodcomp-container">
              <div className="prodcomp-text">
                <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
              </div>
              <button>SHOP NOW</button>
            </div>
            <div className="prodcomp-banner">
              <img src="/prodcomp-banner.jpg" height={350} width={600} alt="banner_product_comparison" />
            </div>
          </div>
          <div className="gifts">
            <div className="gifts-banner">
              <img src="/gifts-banner-2.jpg" height={350} width={600} alt="banner_gifts" />
            </div>
            <div className="gifts-container">
              <div className="gifts-content">
                <div className="gifts-text">
                  <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."</p>
                </div>
                <button>SHOP NOW</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralTemplate>
  );
};

export default withComponentName('HomePage')(Home);

