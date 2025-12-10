"use client";

import { useEffect, useState } from "react";
import React from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";
import Review from "@/app/components/ProfileReview";
import Carousel from "@/app/components/ProfileCarousel";
import Modal from "@/app/components/Modal";
import "@/app/components/Homepage.css";
import { uploadProfilePicture } from "@/lib/profile_picture_upload";
import { randomTennaLoading } from "@/lib/random_tenna_loading";
import { useSession } from "next-auth/react";
import FollowButton from "@/app/components/FollowButton";
import BlockButton from "@/app/components/BlockButton";
import { getFollowers, getFollowing } from "@/lib/following";
import { getBookmarksByUserId } from "@/lib/bookmarks";
import { getFavoritesByUserId } from "@/lib/favorites";
import "@/app/components/Profile.css";
import { useSettings } from "@/app/context/SettingsProvider";
import SkeletonImage from "@/app/components/SkeletonImage";
import ProfileReviewSkeleton from "@/app/components/ProfileReviewSkeleton";

export default function ProfilePage( {params} ){

     //Grab the ID from the URL
    const unwrappedParams = React.use(params);
    const id = unwrappedParams.id;
    console.log("Profile ID from URL: " + id);

    const [profileDetails, setProfileDetails] = useState(null);
    const [profilePicture, setProfilePicture] = useState("http://www.w3.org/2000/svg")
    const [isLoading, setIsLoading] = useState(true);
    const [loadingImage, setLoadingImage] = useState("/images/spr_tenna_t_pose_big.gif");
    // Following/follower numbers
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    //Reviews state
    const [recentReviews, setRecentReviews] = useState([]);
    const [isReviewLoading, setIsReviewLoading] = useState(true);

    //Bookmarks state
    const [bookmarks, setBookmarks] = useState([]);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(true);

    //Favorites state
    const [favorites, setFavorites] = useState([]);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalBio, setModalBio] = useState("");
    const { data: session } = useSession();
    console.log("User session data:", session);

    // Dark Mode
    const { darkMode: darkOn} = useSettings();

    // State for the image file
    const [imageFile, setImageFile] = useState(null);
    //Actually handles the image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(!["image/jpeg", "image/png"].includes(file.type)) {
            alert("Only JPEG and PNG files are allowed.");
            return;
        }
        setImageFile(file);
    }

    useEffect(() => {
        setLoadingImage(randomTennaLoading());
        const fetchProfileDetails = async () => {
            try {
                const response = await fetch(`/api/profiles/get/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch profile details");
                }
                const data = await response.json();
                console.log("Fetched Profile Details:", data);
                setProfileDetails(data);
                setProfilePicture(data.profile_pic_url || "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg");
            }
            catch (error) {
                console.error("Error fetching profile details:", error);
                setProfileDetails(null);
            }
        }

        const fetchRecentReviews = async () => {
            try {
                const response = await fetch(`/api/profiles/get/${id}/recent_reviews?limit=3`);
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
            finally {
                setIsReviewLoading(false);
            }
        }

        const fetchBookmarks = async () => {
            try {
                const data = await getBookmarksByUserId(id, 10); // Fetch up to 10 bookmarks
                console.log("fetched bookmarks: ", data.bookmarks);
                setBookmarks(data.bookmarks || []);
            } catch (error) {
                console.error("Error fetching bookmarks:", error);
                setBookmarks([]);
            }
            finally {
                setIsBookmarkLoading(false);
            }
        }

        const fetchFavorites = async () => {
            try {
                const data = await getFavoritesByUserId(id, 10); // Fetch up to 10 favorites
                console.log("fetched favorites: ", data.favorites);
                setFavorites(data.favorites || []);
            } catch (error) {
                console.error("Error fetching favorites:", error);
                setFavorites([]);
            }
            finally {
                setIsFavoriteLoading(false);
            }
        }

        Promise.all([fetchProfileDetails(), fetchRecentReviews(), fetchBookmarks(), fetchFavorites()])
            .finally(() => setIsLoading(false));

    }, []);

    useEffect(() => {
        if(profileDetails?.bio !== undefined) {
            setModalBio(profileDetails.bio || "");
        }
    }, [profileDetails]);


      useEffect(() => {
        async function fetchFollowInfo() {
          try {
            const followingData = await getFollowing(id);
            const followerData = await getFollowers(id);
            console.log(followingData, followerData);
            setFollowing(followingData.following);
            setFollowers(followerData.followers);
          } catch (error) {
            console.error("Error fetching following data:", error);
          }
        }
        fetchFollowInfo();
      }, [id]);

    
    

    if(!profileDetails && isLoading) {
        return (
            <div>
                <Header/>
                <div className="flex flex-col items-center justify-center h-4/5 mt-7 mb-7">
                    <h1 className="text-2xl mb-4">Loading...</h1>
                    <Image src={loadingImage} alt="Loading" width={500} height={300} />
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
                    <Image src="/images/spr_tenna_failure.gif" alt="Error" width={500} height={300} />
                </div>
                <Footer/>
            </div>
        );
    }

    return (
        <div>   
            <Header/>
            <div className="flex flex-row gap-5 min-h-screen">
                <div className="flex flex-col items-center gap-6 mt-10 ml-10 w-1/5">
                    <Image 
                    className={`flex aspect-square rounded-full mb-2 border-2 justify-center
                        ${darkOn ? "border-[#F3E9DC]" : "border-black"}`} 
                    src={profilePicture}
                    alt="User Image"
                    width="230"
                    height="230"/>

                    {/*Username details & edit modal stuff*/}
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl text-center inria-serif-regular">{profileDetails?.username || "Error: Username not found"}</h1>

                        {/*Verify current page is the current users profile*/}
                        {profileDetails?.user_id === session?.user?.id && (
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth="1" 
                                stroke="currentColor" 
                                className="size-9 transition-transform ease-in-out place-self-center will-change-transform hover:scale-115 hover:cursor-pointer origin-center"
                                onClick={() => setShowModal(true)}>
                                <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" 
                                />
                            </svg>
                        )}
                    </div>

                    {/*Edit modal*/}
                    {showModal &&
                        <Modal onClose={() => setShowModal(false)}>
                            <h1 className="text-2xl text-center">Edit Profile</h1>
                            <div className="flex flex-col w-full">
                                <div className="flex flex-row w-full justify-around items-center mt-5">
                                    <Image
                                        className={`aspect-square rounded-full mb-5 border-2 
                                                     ${darkOn ? "border-[#F3E9DC]" : "border-black"}`}
                                        src={imageFile ? URL.createObjectURL(imageFile) : profilePicture} /*If the user selects a file, use the selected file*/
                                        alt="User Image"
                                        width="170"
                                        height="170">
                                    </Image>

                                    {/*File input for images, hidden*/}
                                    <input type="file" id="profileImageUpload" name="profileImageUpload" accept="image/png, image/jpeg" className="hidden" onChange={handleImageChange} />
                                    <button className={`blue text-sm btn-shadow py-1 px-5 w-fit h-fit rounded-md transition hover:cursor-pointer hover:bg-[#B0E0E6]
                                                ${darkOn ? "text-black" : ""}`}
                                        onClick={async () => {
                                            document.getElementById('profileImageUpload').click();
                                        }}
                                    >
                                        Choose image...
                                    </button>
                                </div>
                                <p className="text-sm font-bold ml-9">Bio</p>
                                <textarea
                                    placeholder="Write a bio"
                                    value={modalBio}
                                    maxLength={144}
                                    onChange={(e) => setModalBio(e.target.value)}
                                    className={`w-6/7 text-sm bg-[#dfcdb59e] rounded-sm h-30 p-2 resize-none focus:outline-none place-self-center
                                            ${darkOn ? "bg-black" : "bg-[#dfcdb59e]"}`}
                                />
                                <button
                                    className="blue text-sm text-black btn-shadow m-4 py-1 px-5 w-fit rounded-md place-self-center"
                                    //onClick to save image and bio
                                    onClick={async () => {

                                        //Profile picture update goes here
                                        if (imageFile) {

                                            try {
                                                const result = await uploadProfilePicture(imageFile, session?.accessToken);
                                                console.log("Profile picture uploaded successfully:", result);
                                                setProfilePicture(result.pfp_url);
                                            } catch (error) {
                                                console.error("Error uploading profile picture:", error);
                                            }

                                        }

                                        //Check if bio has changed
                                        if (modalBio !== profileDetails?.bio) {
                                            //API call to save bio
                                            const response = await fetch('/api/profiles/update/bio', {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ new_bio: modalBio, jwt_token: session?.accessToken })
                                            });

                                            if (!response.ok) {
                                                console.error("Failed to update bio");
                                                return;
                                            }

                                            //Now update local profile details state
                                            setProfileDetails((prevDetails) => ({
                                                ...prevDetails,
                                                bio: modalBio
                                            }));

                                        }

                                        //close modal
                                        setShowModal(false);
                                    }}
                                >
                                    Save </button>
                            </div>
                        </Modal>
                    } {/*End of edit modal*/}

                    <div className="text-center px-2 break-words w-full border-y py-2">
                        <p className="">{profileDetails?.bio || "No description."}</p>
                    </div>

                    <div className="grid grid-cols-2 w-full">
                        <Link className="text-center m-1 hover:text-[#ffa2e9]" href={`/profile/${id}/followers`}>{followers.length}<br></br>Followers</Link>
                        <Link className="text-center m-1 hover:text-[#ffa2e9]" href={`/profile/${id}/following`}>{following.length}<br></br>Following</Link>
                    </div>

                    <FollowButton profileId={id} currentUserId={session?.user?.id} jwtToken={session?.accessToken}></FollowButton>
                    <BlockButton profileId={id} currentUserId={session?.user?.id} jwtToken={session?.accessToken}></BlockButton>
                    
                </div> {/*End of left profile column*/}
                
                <div className="grid w-150 m-15 h-fit">
                    <h1 className="text-md text-start whitespace-nowrap mb-5">Recent Reviews</h1>
                    <div className="flex flex-col gap-5">
                        {isReviewLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <ProfileReviewSkeleton key={index} />
                            ))
                        ) :
                        recentReviews?.length === 0 ? (
                            <p className="font-bold">{"This user hasn't made any reviews yet!"}</p>
                        ) : (
                            recentReviews?.map((review, idx) => (
                                <Review
                                    key={review?.id ?? idx}
                                    reviewData={review}
                                />
                        )))}
                    </div>
                    <Link className="mt-5 hover:text-[#ffa2e9] text-end" href={`/profile/${id}/allreviews`}>See All Reviews</Link>

                </div>


                <div className="w-1/3 h-fit mt-15 mr-10">
                    {/* 
                    <h1 className="text-md text-start font-bold whitespace-nowrap mb-5">No Bookmarks</h1>*/}
                    <h1 className="text-md whitespace-nowrap ml-4">Bookmarks</h1>
                    <Carousel >
                        
                        {isBookmarkLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonImage key={index} useTennaImage={false} />
                            ))
                        ) : 
                        bookmarks.length === 0 ? (
                            <h1 className="text-md -ml-37 font-bold whitespace-nowrap mb-5">This user has no bookmarks yet!</h1>
                        ) : (
                            bookmarks.map((bookmark, index) => (
                                <Link key={index} href={`/${bookmark.media_type}/review/${bookmark.media_id}`}>
                                    <Image
                                        //key={index}
                                        alt={bookmark.title}
                                        src={bookmark.img}
                                        title={bookmark.title}
                                        height={200}
                                        width={200}
                                        className="bookmark"
                                    //onClick={() => window.location.href = `/${bookmark.media_type}/review/${bookmark.media_id}`}
                                    />
                                </Link>
                            ))
                        )}  
                        
                    </Carousel>
                    <h1 className="text-md whitespace-nowrap ml-4 mt-10">Favorites</h1>
                    <Carousel >
                        {isFavoriteLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <SkeletonImage key={index} useTennaImage={false} />
                            ))
                        ) : favorites.length === 0 ? (
                            <h1 className="text-md -ml-37 font-bold whitespace-nowrap mb-5">This user has no favorites yet!</h1>
                        ) : (
                            favorites.map((favorite, index) => (
                                <Link key={index} href={`/${favorite.media_type}/review/${favorite.media_id}`}>
                                    <Image alt={favorite.title} src={favorite.img} title={favorite.title} height={200} width={200} className="bookmark" />
                                </Link>
                            ))
                        )}
                    </Carousel>
                </div> 
                
            </div>
            <Footer/>
        </div>
    );
}