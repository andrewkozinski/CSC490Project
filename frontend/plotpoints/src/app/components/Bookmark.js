"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { checkIfBookmarked, addBookmark, removeBookmark } from "@/lib/bookmarks";

export default function Bookmark({mediaType, mediaId}) {

  const { data: session } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);

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
        await removeBookmark(mediaType, mediaId, session?.accessToken);
      } else {
        await addBookmark(mediaType, mediaId, session?.accessToken);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
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
        className={isBookmarked === true ? "size-8 fill-black cursor-pointer" : "size-8 hover:fill-black cursor-pointer"}
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
