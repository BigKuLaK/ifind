import React from 'react';
import Slider from "react-slick";
import IfindIcon from '@components/IfindIcon';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './styles.scss';

const Carousel = ({ categories, currentCategory, onCategoryLoadClick, onCategoryNavClick }) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 3,
    };

    return (
        <div className="carousel-area">
            <Slider {...settings}>
                {categories.map((category, i) => (
                    <div className="items" key={i}>
                        <button className={["carousel-buttons", currentCategory ? category.id === currentCategory ? "active" : ""
                            : i === 0 ? "active" : ""].join(" ")}
                            onClick={(e) => { onCategoryLoadClick(e, category.id); onCategoryNavClick(category); }}>
                            <IfindIcon icon={category.icon} className="carousel-icons" />
                            <span className="carousel-labels">{(category.label.label).split(" ")[0]}</span>
                        </button>
                    </div>
                ))}
            </Slider>
        </div>
    )
}
export default Carousel;
