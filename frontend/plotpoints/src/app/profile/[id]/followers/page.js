"use client";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import React from "react";
import { getFollowers } from "@/lib/following";
import FollowProfile from "@/app/components/FollowProfile";
import { useSession } from "next-auth/react";

export default function Followers({ params }) {
  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; //user id from the url

  const { data: session } = useSession();
  //Fetch followers data
  const [followersData, setFollowersData] = useState([]);
  useEffect(() => {
    async function fetchFollowers() {
      try {
        const data = await getFollowers(id);
        setFollowersData(data.followers);
        console.log(data);
      } catch (error) {
        console.error("Error fetching followers data:", error);
      }
    }
    fetchFollowers();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
  <Header/>
  <div className="flex-1 flex flex-col">
    <h1 className="text-2xl text-center p-10">Followers</h1>
    <div className="flex flex-row items-center justify-center">
      <div className="w-1/3 bottom-0 text-center mb-15 outline-transparent">
        {followersData.length === 0 ? (
          <p className="text-gray-500 mt-10">
            This user has no followers yet.
          </p>
        ) : (
          followersData.map((user, index) => (
            <FollowProfile 
              key={index} 
              name={user.username} 
              desc={user.bio} 
              user_id={user.user_id} 
              pfp_url={user.profile_pic_url} 
              jwtToken={session?.accessToken} 
              currentUserId={session?.user?.id}
            />
          ))
        )}
      </div>
    </div>
  </div>
  <Footer/>
</div>
  );
}
