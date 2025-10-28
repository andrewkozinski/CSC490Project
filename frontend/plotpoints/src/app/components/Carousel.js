import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";
import React from "react";

const Carousel = ({ label, children }) => {
    const settings = {
        infinite: true,
        dots: true,
        slidesToShow: 5,
        slidesToScroll: 5,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false

    };
    return (
        <div className="pb-10">
            <div>
                <h2 className="text-2xl font-bold">{label}</h2>
            </div>
            <div className="">
                <Slider {...settings}>
                    {children}
                </Slider>
            </div>
        </div>
    );
};
export default Carousel;