import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Star from "./Star";
import fetchUserReview from "@/utils/fetchUserReview";
import SpoilerText from './SpoilerText';
import { useSettings } from "../context/SettingsProvider";

export default function Rating({
  label,
  placeholder,
  id,
  avgRating,
  media,
  reviews,
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const { data: session, status } = useSession();
  const { darkMode: darkOn} = useSettings();

  // Debug logs
  console.log("Rating Component Rendered");
  console.log("Session:", session?.user.id);
  console.log("Reviews Passed In:", reviews);

  const userReview =
    status === "authenticated"
      ? fetchUserReview(reviews, session?.user?.id)
      : null;

  console.log("User Review Found:", userReview);

  // If user already has a review, set the rating from that review
  useEffect(() => {
    if (userReview) {
      console.log("Setting rating from user review:", userReview.rating);
      setRating(userReview.rating);
    }
  }, [userReview]);

  // Handle posting a new review
  const handlePost = async () => {
    console.log(`Post for ${id}:`);
    console.log(`Rating: ${rating} stars`);
    console.log(`Review: ${review}`);

    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        media_id: id,
        media_type: media,
        rating: rating,
        review_text: review,
        jwt_token: session?.accessToken,
      }),
    });

    if (res.status === 401) {
      console.log("User not logged in, redirecting to signin page");
      window.location.href = "/signin";
      // Display a modal or toast notification here
      alert("Session expired, please sign in to post a review.");
      return;
    }

    const data = await res.json();
    console.log(data);
    // Refresh the current page
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto">
      <p>Audience Rating</p>
      <div className="flex flex-row justify-center mb-3">
        {[...Array(5)].map((_, i) => {
          const value = i + 1;
          return (
            <Star
              key={value}
              className={`w-8 h-8 ${value <= avgRating
                ? darkOn ? "fill-white stroke-white" : "fill-black stroke-black"
                : darkOn ? "fill-transparent stroke-white" : "fill-transparent stroke-black"
                }`}
            />
          );
        })}
      </div>

      {status === "authenticated" ? (
        <>
          {/* If the user already has a review, show their rating */}
          {userReview ? (
            <div className="text-center">
              <p className="text-md">Your Rating</p>
              <div className="flex flex-row justify-center mb-2">
                {[...Array(5)].map((_, i) => {
                  const value = i + 1;
                  return (
                    <Star
                      key={value}
                      className={`w-8 h-8 ${value <= userReview.rating
                        ? darkOn ? "fill-white stroke-white" : "fill-black stroke-black"
                        : darkOn ? "fill-transparent stroke-white" : "fill-transparent stroke-black"
                        }`}
                    />
                  );
                })}
              </div>
              <p className="text-xs">
                (You rated {userReview.rating}/5)
              </p>
            </div>
          ) : (
            <>
              {/* Rating section for new review */}
              <p>Your Rating</p>
              <div className="flex flex-row justify-center mb-4">
                {[...Array(5)].map((_, i) => {
                  const value = i + 1;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHover(value)}
                      onMouseLeave={() => setHover(0)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${value <= (hover || rating)
                          ? darkOn ? "fill-white stroke-white" : "fill-black stroke-black"
                          : darkOn ? "fill-transparent stroke-white" : "fill-transparent stroke-black"
                          }`}
                      />
                    </button>

                  );
                })}
              </div>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value.slice(0, 200))}
                className="w-3/4 my-3 py-2 px-3 h-30 border border-gray-400 rounded-sm resize-none text-sm focus:outline-none"
                placeholder={placeholder}
                maxLength={200}
              />

              <p className="text-xs text-center w-full pb-5 pt-2">
                Place two vertical bars around any text to mark it as a spoiler when your review is posted.
              </p>
              <p className="text-xs text-center w-full pb-2">
                {"||This text is a spoiler|| will be posted as "}
                <SpoilerText text="This text is a spoiler" />
              </p>


              {/* Post button */}
              <button
                className="cursor-pointer brown text-sm shadow mt-3 py-2 px-6 rounded-sm transition"
                onClick={handlePost}
              >
                Post!
              </button>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-600 mt-3 text-sm">
          Please{" "}
          <a href="/signin" className="text-blue-500 underline">
            sign in
          </a>{" "}
          to leave a review.
        </p>
      )}
    </div>
  );
}
