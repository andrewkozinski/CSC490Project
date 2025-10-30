"use client";
import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import FollowProfile from "@/app/components/FollowProfile";
import { useEffect, useState } from "react";
import React from "react";
import { getFollowing } from "@/lib/following";
import { useSession } from "next-auth/react";

export default function Following({ params }) {
  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; //user id from the url
  const { data: session } = useSession();
  console.log("User session data:", session);
  
  // Fetch following data
  const [followingData, setFollowingData] = useState([]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const data = await getFollowing(id);
        setFollowingData(data.following);
        console.log(data);
      } catch (error) {
        console.error("Error fetching following data:", error);
      }
    }
    fetchFollowing();
  }, []);

  return (
        <div>
          <Header></Header>
          <h1 className="text-2xl text-center p-10">Following</h1>
          <div className="flex flex-row items-center justify-center h-screen">
            
            <div className="w-3/4 h-full bottom-0 text-center mb-3 outline-transparent">
            {followingData.length === 0 ? (
                <p className="text-gray-500 mt-10">
                  This user isnt following anyone yet.
                </p>
              ) : (
              followingData.map((user, index) => (
                <FollowProfile key={index} name={user.username} desc={user.bio} user_id={user.user_id} pfp_url={user.profile_pic_url} jwtToken ={session?.accessToken} currentUserId={session?.user?.id}></FollowProfile>
              )))
            }
            </div>
            
          </div>
      <Footer></Footer>
    </div>
  );
}
