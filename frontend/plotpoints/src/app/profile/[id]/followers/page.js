"use client";
import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import { useEffect, useState } from "react";
import React from "react";
import { getFollowers } from "@/lib/following";
import FollowProfile from "@/app/components/FollowProfile";

export default function followers({ params }) {

  //Grab the ID from the URL
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; //user id from the url

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
    <div>
      <Header></Header>
      <div className="flex items-center justify-center h-screen">
        <div className="w-3/4 h-full bottom-0 text-center shadow-lg mb-3 outline-transparent">

          {followersData.map((user, index) => (
            <FollowProfile key={index} name={user.username} desc={user.bio} user_id={user.user_id} pfp_url={user.profile_pic_url}></FollowProfile>
          ))}

        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
