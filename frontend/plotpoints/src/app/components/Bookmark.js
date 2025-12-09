"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { checkIfBookmarked, addBookmark, removeBookmark } from "@/lib/bookmarks";
import { useSettings } from "../context/SettingsProvider";

export default function Bookmark({mediaType, mediaId}) {

  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { darkMode } = useSettings();
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (session && session.user && session.user.id) {
        try {
          const result = await checkIfBookmarked(mediaType, mediaId, session?.user?.id);
          setIsBookmarked(result.is_bookmarked);
        }
        catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      }
    };
    checkBookmarkStatus();
  }, [session, mediaType, mediaId]);

  const handleBookmark = async () => {
    if (!session || !session.accessToken) {
      alert("You must be logged in to bookmark items.");
      return;
    }
    try {
      if (isBookmarked) {
        //optimistic update
        setIsBookmarked(false);
        await removeBookmark(mediaType, mediaId, session?.accessToken);
      } else {
        //optimistic update
        setIsBookmarked(true);
        await addBookmark(mediaType, mediaId, session?.accessToken);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      // Revert optimistic update on error
      setIsBookmarked(!isBookmarked);
    }
  };

  return (
    <div className="flex items-center pb-2">
      {isBookmarked ? (
        <h1 className="mr-2">Remove from Bookmarks</h1>
      ) : (
        <h1 className="mr-2">Add to Bookmarks</h1>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="currentColor"
        className={`size-8 cursor-pointer ${
          isBookmarked
            ? darkMode
              ? "fill-[#F3E9DC] stroke-[#F3E9DC]"
              : "fill-black stroke-black"
            : darkMode
            ? "hover:fill-[#F3E9DC] stroke-[#F3E9DC] fill-transparent"
            : "hover:fill-black stroke-black fill-transparent"
        }`}
        onClick={handleBookmark}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
        />
      </svg>
    </div>
  );
}
