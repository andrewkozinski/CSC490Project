"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

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
            <div className="grid grid-cols-4 gap-5 justify-center">
                <div className="items-center justify-center m-10 border-2 w-70">
                    <img 
                    className="aspect-square rounded-full w-55 h-55 border-2 border-[#dfcdb5]" 
                    src="/images/cat.jpg">
                    </img>
                    {/* Get username */}
                    <h1 className="text-4xl text-center inria-serif-regular">{session ? session.user.name : "Error: Username not found"}</h1>
                    <p>{"User's bio here"}</p>
                </div>
                <div className="cols-span-3">
                    <div className="flex gap-5 overflow-y-auto px-10 py-5 h-70 items-center">

                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}