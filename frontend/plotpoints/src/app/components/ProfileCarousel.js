import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Profile.css";
import React, { useEffect, useRef } from 'react';


export default function ProfileCarousel({children}) {
    const sliderRef = useRef(null);

    useEffect(() => {
    // Force slick to reinitialize after component mounts
    if (sliderRef.current) {
      setTimeout(() => {
        sliderRef.current.slickGoTo(0);
        }, 100);
        }
    }, []);

    const settings = {
        infinite: true,
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        lazyLoad: true,
        autoplay: false,
        autoplaySpeed: 5000,
        arrows: false,
        speed: 1000,
        vertical: false,
        adaptiveHeight: false

    };
    return (
        <div className="pb-10 w-full profile-carousel" >
            <div>
                {/* <h1 className="text-md text-start whitespace-nowrap mb-5">{label}</h1> */}
            </div>
            <div className="">
                <Slider {...settings}>
                    {children}
                </Slider>
            </div>
        </div>
    );
};
