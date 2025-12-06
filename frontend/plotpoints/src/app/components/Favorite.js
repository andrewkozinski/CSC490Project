"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { checkIfFavorited, addFavorite, removeFavorite } from "@/lib/favorites";
import { useSettings } from "../context/SettingsProvider";

export default function Favorite({mediaType, mediaId}) {

  const { data: session } = useSession();
  const [isFavorited, setIsFavorited] = useState(false);
  const { darkMode } = useSettings();


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
        className={`size-8 cursor-pointer ${
          isFavorited
            ? darkMode
              ? "fill-[#F3E9DC] stroke-[#F3E9DC]"
              : "fill-black stroke-black"
            : darkMode
            ? "hover:fill-[#F3E9DC] stroke-[#F3E9DC] fill-transparent"
            : "hover:fill-black stroke-black fill-transparent"
        }`}
        onClick={handleFavorite}
      >
        <path 
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </div>
  );
}
