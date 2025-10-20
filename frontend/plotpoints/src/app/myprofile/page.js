"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import fetchUserReview from "@/utils/fetchUserReview";
import Review from "../components/ProfileReview";
import GenreContainer from "../components/GenreContainer";

import { useSession } from "next-auth/react";

export default function ProfilePage(){
    const { data: session } = useSession();
    console.log("User session data:", session);
    
    //If no session exists, redirect to login
    //Can also be replaced with a forced redirect using useRouter from next/navigation
    if (!session) {
        return (
            <div>
                <Header/>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-2xl mb-4">You must be logged in to view your profile!</h1>
                    <Link href="/signin" className="text-blue-500 underline">Go to Login</Link>
                </div>
                <Footer/>
            </div>
        );
    }

    return (
        <div>   
            <Header/>
            <div className="grid grid-cols-4 gap-5 justify-center min-h-screen">
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
                        <div className="flex flex-row justify-center items-center">
                            <h1 className="text-3xl text-center inria-serif-regular">{session ? session.user.name : "Error: Username not found"}</h1>
                            <img className="w-8 h-8 ml-3 hover:cursor-pointer hover:border-1 hover:border-transparent" src="/images/pencil.svg"></img>
                        </div>
                        <p className="text-center border-y-1 self-center">{"User's bio here"}</p>
                        <div className="grid grid-cols-2">
                            <p className="text-center">Followers</p>
                            <p className="text-center">Following</p>
                        </div>
 
                    </div>
                    
                </div>
                <div className="m-15">
                    <h1 className="text-md text-start whitespace-nowrap mb-5">Recent Reviews</h1>
                    <div className="flex flex-col gap-5">
                        <Review className=""/>
                        <Review className=""/>
                        <Review className=""/>
                    
                </div>
         
                </div>
                <div className="m-15">
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
            <Footer className=""/>
        </div>
    );
}