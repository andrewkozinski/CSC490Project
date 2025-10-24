"use client";
import { useEffect, useState } from "react";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Review from "@/app/components/ProfileReview";
import GenreContainer from "@/app/components/GenreContainer";


import { useSession } from "next-auth/react";

export default function ProfilePage( {params} ){

     //Grab the ID from the URL
    const unwrappedParams = React.use(params);
    const id = unwrappedParams.id;
    console.log("Profile ID from URL: " + id);

    const [profileDetails, setProfileDetails] = useState(null);
    const [recentReviews, setRecentReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    

    const [showModal, setShowModal] = useState(false);
    const { data: session } = useSession();
    console.log("User session data:", session);

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
            <div className="flex flex-row gap-5 justify-center min-h-screen">
                <div className="mt-10 ml-10 w-70 h-fit">
                    <Image 
                    className="aspect-square rounded-full mb-5 ml-6 border-2 border-[#dfcdb5]" 
                    src="/images/cat.jpg"
                    alt="User Image"
                    width="230"
                    height="230">
                    </Image>
                    {/* Get username */}
                    <div className="grid grid-rows-4 gap-2">
                        <div className="flex flex-row justify-center items-center">
                            <h1 className="text-3xl text-center inria-serif-regular">{session ? session.user.name : "Error: Username not found"}</h1>
                            <img className="w-8 h-8 ml-3 hover:cursor-pointer hover:scale-110" src="/images/pencil.svg"
                                onClick={() => setShowModal(true)}/>
                                {showModal &&
                                <Modal onClose={() => setShowModal(false)}>
                                    <h1 className="text-2xl text-center">Edit Profile</h1>
                                    <div className="flex flex-col w-full">   
                                        <div className="flex flex-row w-full justify-around items-center mt-5">
                                            <Image 
                                                className="aspect-square rounded-full mb-5 border-2 border-[#dfcdb5]" 
                                                src="/images/cat.jpg"
                                                alt="User Image"
                                                width="170"
                                                height="170">
                                            </Image> 
                                            <button className="blue text-sm shadow py-1 px-5 w-fit h-fit rounded-sm">Choose image...</button>
                                        </div>
                                        <p className="text-sm font-bold text-gray-700 ml-9">Bio</p>                               
                                        <textarea
                                        placeholder="Write a bio"
                                        className="w-6/7 text-sm bg-[#dfcdb59e] rounded-sm h-30 p-2 resize-none focus:outline-none place-self-center"
                                        />
                                        <button
                                        className="blue text-sm text-black shadow m-4 py-1 px-5 w-fit rounded-sm place-self-center"
                                        //onClick to save image and bio
                                        > 
                                        Save </button>
                                    </div>
                                </Modal>
                                }
                        </div>
                        <p className="text-center border-y-1 self-center">{"User's bio here"}</p>
                        <div className="grid grid-cols-2">
                            <Link className="text-center m-1" href="/myprofile/followers">Followers</Link>
                            <Link className="text-center m-1" href="/myprofile/following">Following</Link>
                        </div>
 
                    </div>
                    
                </div>
                
                <div className="m-15 h-fit">
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
                <div className="m-15 h-fit">
                    <h1 className="text-md text-start whitespace-nowrap">My Bookmarks</h1>
                    <GenreContainer >
                        <img
                        src="https://image.tmdb.org/t/p/w500/22AouvwlhlXbe3nrFcjzL24bvWH.jpg"
                        title="Kpop Demon Hunters"
                        className="cover"
                        />
                        <img
                        src="https://image.tmdb.org/t/p/w500/wPLysNDLffQLOVebZQCbXJEv6E6.jpg"
                        title="Superman 2025"
                        className="cover"
                        />
                        <img
                        src="https://image.tmdb.org/t/p/w500/cpf7vsRZ0MYRQcnLWteD5jK9ymT.jpg"
                        title="Weapons"
                        className="cover"
                        />
                    </GenreContainer>
                </div> 
                
            </div>
            <Footer/>
        </div>
    );
}