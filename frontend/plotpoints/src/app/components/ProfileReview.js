import Star from "./Star";
import ReviewText from "./ReviewText";
import { useSettings } from "../context/SettingsProvider";
import { useState, useEffect } from "react";
import "./Profile.css";
import {useRouter} from "next/navigation";

export default function ProfileReview({ reviewData }) {

    const router = useRouter();

    const {title, img, review_text, rating, media_type, media_id} = reviewData || {
        title: "Superman",
        img: "https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg",
        review_text: "An awesome take on a classic superhero story!",
        rating: 5,
        media_type: "movie",
        media_id: 1061474
    };
    
    // const showReviewText = true;
    const { reviewText: showReviewText } = useSettings();

    const { darkMode: darkOn} = useSettings();

    const [isBlockedUser, setIsBlockedUser] = useState(false);

    //   useEffect(() => {
    //     if (!currentUserId || !jwtToken || userId === currentUserId) return;
    
    //     const fetchBlockedStatus = async () => {
    //       try {
    //         const data = await isBlocked(userId, currentUserId);
    //         setIsBlockedUser(data.is_blocked);
    //       } catch (err) {
    //         console.error("Error checking block status:", err);
    //       }
    //     };
    //     fetchBlockedStatus();
    //   }, [userId, currentUserId, jwtToken]);

    return (
        <div className="flex flex-row rounded-[1px] max-w-full gap-4">
            <img
                src={img}
                title={title}
                className={`max-w-27 max-h-37 min-w-27 max-w-37 rounded-sm hover:cursor-pointer
                    ${ darkOn ? 
                        "hover:outline-1 hover:outline-[#F3E9DC] hover:outline-offset-3" 
                      : "hover:outline-1 hover:outline-black hover:outline-offset-3"
                    }`}
                // onClick={() => window.location.href = `/${media_type}/review/${media_id}`}
                onClick={() => router.push(`/${media_type}/review/${media_id}`)}
            />
            <div className="grid grid-rows-2 inline-block ">
                    <h1 className="text-2xl text-start inria-serif-regular mb-2">{title}</h1>
                    <div className="flex flex-row justify-start mb-3">
                    {[...Array(5)].map((_, i) => {
                        const value = i + 1;
                        return (
                            <Star
                            key={value}
                            className={`w-6 h-6
                                ${value <= rating
                                ? darkOn ? "fill-[#F3E9DC] stroke-[#F3E9DC]" : "fill-black stroke-black"
                                : darkOn ? "fill-transparent stroke-[#F3E9DC]" : "fill-transparent stroke-black"
                                }`}
                            />

                                );
                                })}
                    </div>
                    {/* <p className="w-full text-sm">{review_text}</p> */}
                    {/* show review and blocked, show review and */}
                    {showReviewText ? 
                        isBlockedUser ? 
                        <div/> 
                        :
                        <ReviewText className="w-full text-sm" content={review_text}/> 
                    : <div/> }
                    
                    
            </div>    
            
        </div>
    );
}
