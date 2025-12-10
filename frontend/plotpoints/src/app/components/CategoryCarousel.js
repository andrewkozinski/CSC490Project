import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";
import React from "react";

const CatCarousel = ({ label, children }) => {
    const settings = {
        infinite: true,
        dots: true,
        slidesToShow: 8,
        slidesToScroll: 7,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
        speed: 1500

    };
    return (
        <div className="pb-10">
            <div>
                <h2 className="text-xl font-bold pl-5 ">{label}</h2>
            </div>
            <div className="">
                <Slider {...settings}>
                    {children}
                </Slider>
            </div>
        </div>
    );
};
export default CatCarousel;