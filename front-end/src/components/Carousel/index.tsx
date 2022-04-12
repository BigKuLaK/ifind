import React, { useCallback } from "react";
import Slider from "react-slick";
import IfindIcon from "@components/IfindIcon";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles.module.scss";

const Carousel = ({
  categories,
  currentCategory,
  onCategoryLoadClick,
  onCategoryNavClick,
}: CarouselProps) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const onClick = useCallback(
    (e, category) => {
      onCategoryLoadClick && onCategoryLoadClick(e, category.id);
      onCategoryNavClick && onCategoryNavClick(category);
    },
    [onCategoryLoadClick, onCategoryNavClick]
  );

  return (
    <div className="carousel-area">
      <Slider {...settings}>
        {categories.map((category, i) => (
          <div className="items" key={i}>
            <button
              className={[
                "carousel-buttons",
                currentCategory
                  ? category?.id === currentCategory
                    ? "active"
                    : ""
                  : i === 0
                  ? "active"
                  : "",
              ].join(" ")}
              onClick={(e) => onClick(e, category)}
            >
              <IfindIcon icon={category?.icon as string} className="carousel-icons" />
              <span className="carousel-labels">
                {category?.label?.label?.split(" ")[0]}
              </span>
            </button>
          </div>
        ))}
      </Slider>
    </div>
  );
};
export default Carousel;
