"use client";
import Footer from "@/app/components/Footer";
import Header from "../../../components/Header";
import FollowProfile from "@/app/components/FollowProfile";
import { useEffect, useState } from "react";
import React from "react";
import { getFollowing } from "@/lib/following";

export default function following({ params }) {
  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; //user id from the url
  
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
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-3/4 h-full bottom-0 text-center shadow-lg mb-3 outline-transparent">
          {/* <FollowProfile name="max" desc="yerrr"></FollowProfile> */}
          {followingData.map((user, index) => (
            <FollowProfile key={index} name={user.username} desc={user.bio} user_id={user.id}></FollowProfile>
          ))}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
