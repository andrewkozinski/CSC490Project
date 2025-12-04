"use client";

import Star from "./Star";
import "./Homepage.css";
import ReviewText from "./ReviewText";
import { useState, useEffect } from "react";
import Image from "next/image";
import { isBlocked } from "@/lib/blocking";
import { useSession } from "next-auth/react";
import { useSettings } from "../context/SettingsProvider";

export default function HomepageReview({ reviewData }) {
    const {
        title,
        img,
        review_text,
        username,
        profile_pic_url,
        rating,
        media_type,
        media_id,
        user_id
    } = reviewData || {
        title: "Superman",
        img: "https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg",
        review_text: "An awesome take on a classic superhero story!",
        username: "Username",
        profile_pic_url: "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg",
        rating: 5,
        media_type: "movie",
        media_id: 1061474,
        user_id: 5
    };

    const { data: session } = useSession();
    const currentUserId = session?.user?.id;

    const [pfp, setPfp] = useState(profile_pic_url);
    const [isBlockedUser, setIsBlockedUser] = useState(false);

    const { reviewText: showReviewText } = useSettings();
    const { darkMode: darkOn} = useSettings();

    useEffect(() => {
        const testImg = new window.Image();
        testImg.src = profile_pic_url;
        testImg.onload = () => setPfp(profile_pic_url);
    }, [profile_pic_url]);

    useEffect(() => {
        if (!currentUserId || user_id === currentUserId) return;

        const fetchBlockedStatus = async () => {
            try {
                const data = await isBlocked(user_id, currentUserId);
                setIsBlockedUser(data.is_blocked);
            } catch (err) {
                console.error("Error checking block status:", err);
            }
        };

        fetchBlockedStatus();
    }, [user_id, currentUserId]);

    const displayUsername = isBlockedUser ? "Blocked User" : username;
    const displayText = isBlockedUser ? "This message is from a blocked user" : review_text;
    const displayPfp = isBlockedUser
        ? "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg"
        : pfp;

    return (
        <div className="flex flex-row rounded-[1px] w-max gap-4">
            <img
                src={img}
                title={title}
                className={`max-w-27 max-h-42 rounded-sm hover:cursor-pointer
                    ${ darkOn ? 
                        "hover:outline-1 hover:outline-[#F3E9DC] hover:outline-offset-3" 
                      : "hover:outline-1 hover:outline-black hover:outline-offset-3"
                    }`}
                onClick={() => window.location.href = `/${media_type}/review/${media_id}`}
            />
            <div className="grid grid-rows-2 inline-block">
                <h1 className="text-2xl text-start inria-serif-regular mb-2 w-80">{title}</h1>
                <div className="flex flex-row items-center gap-2">
                    <div
                        className="group flex items-center justify-center w-11 h-11 rounded-full bg-transparent border-2 m-2 cursor-pointer shrink-0 transition-transform duration-200 hover:scale-115"
                        onClick={() => window.location.href = `/profile/${user_id}`}
                    >
                        <Image
                            src={displayPfp}
                            title={username}
                            alt="profile picture"
                            width={50}
                            height={50}
                            className="rounded-full w-10 h-10 object-cover"
                            onError={() =>
                                setPfp("https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg")
                            }
                        />
                    </div>
                    <p
                        onClick={() => window.location.href = `/profile/${user_id}`}
                        className="-ml-1 underline underline-offset-4 hover:text-[#ffa2e9] hover:cursor-pointer"
                    >
                        {displayUsername}
                    </p>
                    <div className="flex flex-row justify-start">
                        {[...Array(5)].map((_, i) => {
                            const value = i + 1;
                            return (
                                <Star
                                    key={value}
                                    className={`w-6 h-6 ${value <= rating
                                        ? darkOn ? "fill-[#F3E9DC] stroke-[#F3E9DC]" : "fill-black stroke-black" 
                                        : darkOn ? "fill-transparent stroke-[#F3E9DC]" : "fill-transparent stroke-black"
                                        }`}
                                />
                            );
                        })}
                    </div>
                </div>
                {showReviewText == true ? 
                <ReviewText className="max-w-80 text-sm pt-2" content={displayText} />
                : <div/> }
                
            </div>
        </div>
    );
}
