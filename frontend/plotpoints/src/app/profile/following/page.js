"use client";
import Footer from "@/app/components/Footer";
import Header from "../../components/Header";
import FollowProfile from "@/app/components/FollowProfile";
import { useEffect, useState } from "react";
import { getFollowing } from "@/lib/following";

export default function following() {

  // Fetch following data
  const [followingData, setFollowingData] = useState([]);

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const data = await getFollowing(5); // This will be replaced with actual user ID from the url
        setFollowingData(data);
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
          <FollowProfile name="max" desc="yerrr"></FollowProfile>
          <FollowProfile></FollowProfile>
          <FollowProfile></FollowProfile>
          <FollowProfile></FollowProfile>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
