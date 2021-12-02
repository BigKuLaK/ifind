//import React from 'react';
// import {
//     CarouselProvider, Slider, Slide,
//     ButtonBack, ButtonNext,
//     ImageWithZoom
// } from 'pure-react-carousel';
// import 'pure-react-carousel/dist/react-carousel.es.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './reactcarousel.scss'

const homecarousel = () => {
    return (
        <>
            {/* <div className="title-container">
                <h4 className="title">TRENDING AND POPULAR PRODUCTS</h4>
            </div> */}
            <Carousel className="Scontainer"
                infiniteLoop
                autoPlay
                showThumbs={false}
                showStatus={false}
                centerMode
                centerSlidePercentage={90}
            >
                <div>
                    <img src="/offers-banner.jpg" height="250px" width="300px" alt="carousel-image1" />
                </div>
                <div>
                    <img src="/prodcomp-banner.jpg" height="250px" width="300px" alt="carousel-image2" />
                </div>
                <div>
                    <img src="/gifts-banner-2.jpg" height="250px" width="300px" alt="carousel-image3" />
                </div>
                <div>
                    <img src="/banner2.jpg" height="250px" width="300px" alt="carousel-image4" />
                </div>
                <div>
                    <img src="/banner3.jpg" height="250px" width="=300px" alt="carousel-image5" />
                </div>

            </Carousel>
            {/* <div className="home-carousel"> */}
            {/* <CarouselProvider
                    visibleSlides={1}
                    totalSlides={5}
                    step={1}
                    naturalSlideWidth={400}
                    naturalSlideHeight={250}
                    hasMasterSpinner
                    infinite
                    isPlaying
                    touchEnabled
                >
                    <div className="title-container">
                        <h4 className="title">TRENDING AND POPULAR PRODUCTS</h4>
                    </div>

                    <div className="hcarousel-container">
                        <Slider className="slider">
                            <Slide index={0}>
                                <ImageWithZoom src="/offers-banner.jpg" />
                            </Slide>
                            <Slide index={1}>
                                <ImageWithZoom src="/gifts-banner.jpg" />
                            </Slide>
                            <Slide index={2}>
                                <ImageWithZoom src="/banner1.jpg" />
                            </Slide>
                            <Slide index={3}>
                                <ImageWithZoom src="/banner2.jpg" />
                            </Slide>
                            <Slide index={4}>
                                <ImageWithZoom src="/banner3.jpg" />
                            </Slide>
                        </Slider>
                        <ButtonBack className="buttonBack"><i className="fa fa-angle-left"></i></ButtonBack>
                        <ButtonNext className="buttonNext"><i className="fa fa-angle-right"></i></ButtonNext>
                    </div>
                </CarouselProvider> */}
            {/* </div> */}
        </>
    )
}

export default homecarousel;