import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Star from "./Star";
import fetchUserReview from "@/utils/fetchUserReview";

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
              className={`w-8 h-8 ${
                value <= avgRating
                  ? "fill-[#FFFC00] stroke-neutral-950"
                  : "fill-transparent stroke-neutral-950"
              }`}
            />
          );
        })}
      </div>

      {status === "authenticated" ? (
        <>
          {/* If the user already has a review, show their rating */}
          {userReview ? (
            <div className="text-center mt-2">
              <p className="text-gray-700 text-sm mb-2">Your Rating:</p>
              <div className="flex flex-row justify-center mb-2">
                {[...Array(5)].map((_, i) => {
                  const value = i + 1;
                  return (
                    <Star
                      key={value}
                      className={`w-8 h-8 ${
                        value <= userReview.rating
                          ? "fill-[#FFFC00] stroke-neutral-950"
                          : "fill-transparent stroke-neutral-950"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-gray-600 text-xs">
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
                      className={`cursor-pointer ${
                        value <= (hover || rating)
                          ? "fill-[#FFFC00] stroke-neutral-950"
                          : "fill-transparent stroke-neutral-950"
                      }`}
                    >
                      <Star className="w-8 h-8" />
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

              {/* Post button */}
              <button
                className="cursor-pointer brown text-black font-medium shadow mt-3 py-2 px-6 rounded-sm transition"
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
