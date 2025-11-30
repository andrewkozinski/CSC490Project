"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { checkIfFavorited, addFavorite, removeFavorite } from "@/lib/favorites";

export default function Favorite({mediaType, mediaId}) {

  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (session && session.user && session.user.id) {
        try {
          const result = await checkIfFavorited(mediaType, mediaId, session?.user?.id);
          setIsFavorited(result.is_favorited);
        }
        catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };
    checkFavoriteStatus();
  }, [session, mediaType, mediaId]);

  const handleFavorite = async () => {
    if (!session || !session.accessToken) {
      alert("You must be logged in to favorite items.");
      return;
    }
    try {
      if (isFavorited) {
        await removeFavorite(mediaType, mediaId, session?.accessToken);
      } else {
        await addFavorite(mediaType, mediaId, session?.accessToken);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="flex items-center pb-2">
      {isFavorited ? (
        <h1 className="mr-2">Remove from Favorites</h1>
      ) : (
        <h1 className="mr-2">Add to Favorites</h1>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="currentColor"
        className={isFavorited === true ? "size-8 fill-black cursor-pointer" : "size-8 hover:fill-black cursor-pointer"}
        onClick={handleFavorite}
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
