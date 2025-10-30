import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Profile.css";
import React from "react";

const ProfileCarousel = ({ label, children}) => {
    const settings = {
        infinite: true,
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        lazyLoad: true,
        autoplay: false,
        autoplaySpeed: 5000,
        arrows: false,
        speed: 1000

    };
    return (
        <div className="pb-10 w-full">
            <div>
                <h1 className="text-md text-start whitespace-nowrap mb-5">{label}</h1>
            </div>
            <div className="">
                <Slider {...settings}>
                    {children}
                </Slider>
            </div>
        </div>
    );
};
export default ProfileCarousel;