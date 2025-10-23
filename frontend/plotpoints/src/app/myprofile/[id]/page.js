"use client";
import { useEffect, useState } from "react";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Review from "@/app/components/ProfileReview";

import { useSession } from "next-auth/react";

export default function ProfilePage( {params} ){

     //Grab the ID from the URL
    const unwrappedParams = React.use(params);
    const id = unwrappedParams.id;
    console.log("Profile ID from URL: " + id);

    const [profileDetails, setProfileDetails] = useState(null);
    const [recentReviews, setRecentReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        const fetchProfileDetails = async () => {
            try {
                const response = await fetch(`/api/profiles/get/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch profile details");
                }
                const data = await response.json();
                console.log("Fetched Profile Details:", data);
                setProfileDetails(data);
            }
            catch (error) {
                console.error("Error fetching profile details:", error);
                setProfileDetails(null);
            }
        }

        const fetchRecentReviews = async () => {
            try {
                const response = await fetch(`/api/profiles/get/${id}/recent_reviews`);
                if (!response.ok) {
                    throw new Error("Failed to fetch recent reviews");
                }
                const data = await response.json();
                console.log("Fetched Recent Reviews:", data);
                setRecentReviews(data.reviews || []);
            }
            catch (error) {
                console.error("Error fetching recent reviews:", error);
                setRecentReviews([]);
            }
        }

        Promise.all([fetchProfileDetails(), fetchRecentReviews()])
            .then(() => setIsLoading(false));

    }, []);

    const { data: session } = useSession();
    console.log("User session data:", session);
    

    if(!profileDetails && isLoading) {
        return (
            <div>
                <Header/>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl mb-4">Loading...</h1>
                    <Image src="/images/spr_tenna_t_pose_big.gif" alt="Loading" width={500} height={300} />
                </div>
                <Footer/>
            </div>
        );
    }

    
    if(!profileDetails) {
        return (
            <div>
                <Header/>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl mb-4">Error: Profile not found.</h1>
                </div>
                <Footer/>
            </div>
        );
    }

    //If no session exists, redirect to login
    //Can also be replaced with a forced redirect using useRouter from next/navigation
    // if (!session) {
    //     return (
    //         <div>
    //             <Header/>
    //             <div className="flex flex-col items-center justify-center min-h-screen">
    //                 <h1 className="text-2xl mb-4">You must be logged in to view your profile!</h1>
    //                 <Link href="/signin" className="text-blue-500 underline">Go to Login</Link>
    //             </div>
    //             <Footer/>
    //         </div>
    //     );
    // }

    return (
        <div>   
            <Header/>
            <div className="grid grid-cols-4 gap-5 justify-center">
                <div className="mt-10 ml-25 w-65">
                    <Image 
                    className="aspect-square rounded-full mb-5 items-center border-2 border-[#dfcdb5]" 
                    src="/images/cat.jpg"
                    alt="User Image"
                    width="256"
                    height="256">
                    </Image>
                    {/* Get username */}
                    <div className="grid grid-rows-4 gap-2">
                        <h1 className="text-3xl text-center inria-serif-regular">{session ? session.user.name : "Error: Username not found"}</h1>
                        <p className="text-center border-y-1 self-center">{profileDetails?.bio || "No description."}</p>
                        <div className="grid grid-cols-2">
                            <Link className="text-center m-1" href="/myprofile/followers">Followers</Link>
                            <Link className="text-center m-1" href="/myprofile/following">Following</Link>
                        </div>
 
                    </div>
                    
                </div>
                <div className="m-15">
                    <h1 className="text-md text-start whitespace-nowrap mb-5">Recent Reviews</h1>
                    <div className="flex flex-col gap-5">
                        {recentReviews?.map((review, idx) => (
                            <Review
                                key={review?.id ?? idx}
                                reviewData={review}
                            />
                        ))}
                </div>
         
                </div>
                <div className="m-15">
                        <h1 className="text-md text-start whitespace-nowrap">My Bookmarks</h1>
                </div> 
                
            </div>
            <Footer/>
        </div>
    );
}