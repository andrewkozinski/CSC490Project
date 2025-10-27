// Filename - ImageSlider.js

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import React from "react";

const CoverSlider = ({ label, children }) => {
    const settings = {
        infinite: true,
        dots: true,
        slidesToShow: 6,
        slidesToScroll: 3,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 2000,
    };
    return (
        <>
            <div className="tag">
                <h2 className="text-2xl font-bold pl-10">{label}</h2>
            </div>
            <div className="imgslider">
                <Slider {...settings}>
                    {children}
                </Slider>
            </div>
        </>
    );
};
export default CoverSlider;