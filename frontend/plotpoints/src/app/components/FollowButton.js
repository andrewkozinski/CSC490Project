"use client";

import { useState, useEffect } from "react";
import { followUser, unfollowUser, isFollowing } from "@/lib/following";

export default function FollowButton({ profileId, currentUserId, jwtToken }) {
  console.log(jwtToken);
  console.log(isJwtExpired(jwtToken));

  const [isUserFollowing, setIsUserFollowing] = useState(false);
  useEffect(() => {
    if (profileId === currentUserId) return;
    if (jwtToken == undefined) return;
    if (currentUserId == undefined) {
      return null;
    }
    if (isJwtExpired(jwtToken)) return;
    const checkFollowingStatus = async () => {
      try {
        const data = await isFollowing(profileId, jwtToken);
        console.log("Follow check response:", data);
        setIsUserFollowing(data.is_following);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };
    checkFollowingStatus();
  }, [profileId, currentUserId, jwtToken]);

  if (
    !isUserFollowing &&
    profileId != currentUserId &&
    jwtToken != undefined &&
    !isJwtExpired(jwtToken)
  ) {
    return (
      <button
        onClick={async () => {
          await followUser(profileId, jwtToken);
          window.location.reload();
        }}
        className="px-4 py-2 w-3/5 rounded-md text-white flex flex-row justify-center place-self-center transition cursor-pointer bg-[var(--color-brown)] h-10 hover:bg-[#7e675bd0]"
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
  if (isUserFollowing && profileId != currentUserId) {
    return (
      <button
        onClick={async () => {
          await unfollowUser(profileId, jwtToken);
          window.location.reload();
        }}
        className="px-4 py-2 w-3/5 rounded-md text-white flex justify-center place-self-center transition cursor-pointer bg-[var(--color-brown)] h-10 hover:bg-[#7e675bd0]"
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
            d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
          />
        </svg>
        <p>Unfollow</p>
      </button>
    );
  }
  if (isJwtExpired(jwtToken)) {
    return null;
  }
  return null;
}

function isJwtExpired(token) {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiry = payload.exp * 1000;

  return Date.now() > expiry;
}
