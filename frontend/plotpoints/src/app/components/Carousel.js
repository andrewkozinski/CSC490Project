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
        autoplaySpeed: 5000,
        arrows: true,
        speed: 1000

    };
    return (
        <div className="pb-10 w-9/10">
            <div>
                <h2 className="text-2xl font-bold pl-4 pb-3">{label}</h2>
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