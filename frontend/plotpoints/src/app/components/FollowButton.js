"use client";

import { useState, useEffect } from "react";
import { isFollowing } from "@/lib/following";

const followSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 
        3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 
        19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 
        12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
    />
  </svg>
);

const followingSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 
        7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 
        0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 
        21a8.966 8.966 0 0 1-5.982-2.275M15 
        9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

export default function FollowButton({ profileId, currentUserId, jwtToken }) {
  if (profileId === currentUserId) return;
  if (!jwtToken) return;
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  useEffect(() => {
    if (profileId === currentUserId) return; // Your profile
    if (!jwtToken) return; // Not logged in
    const checkFollowingStatus = async () => {
      console.log("Checking if user follows this profile...");
      console.log(profileId, "and", currentUserId);
      try {
        const data = await isFollowing(profileId, jwtToken);
        console.log("Follow check response:", data);
        setIsUserFollowing(data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };

    checkFollowingStatus();
  }, [profileId, currentUserId, jwtToken]);

  if (currentUserId == undefined) {
    return null;
  }

  if (!isUserFollowing && profileId != currentUserId) {
    return (
      <button
        onClick={() => console.log("Follow button clicked for", profileId)}
        className="px-4 py-2 rounded text-white flex flex-row justify-center transition cursor-pointer bg-[var(--color-brown)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
        <p>Follow</p>
      </button>
    );
  }
  return null;
}
