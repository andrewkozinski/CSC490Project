import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Star from "./Star";
import fetchUserReview from "@/utils/fetchUserReview";

export default function Rating({ label, placeholder, id, avgRating, media, reviews }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const { data: session, status } = useSession();

  // Debug logs
  console.log("Rating Component Rendered");
  console.log("Session:", session?.user.id);
  console.log("Reviews Passed In:", reviews);

  const userReview = status === "authenticated"
    ? fetchUserReview(reviews, session?.user?.id)
    : null;

  console.log("User Review Found:", userReview);

  useEffect(() => {
    if (userReview) {
      console.log("Setting rating from user review:", userReview.rating);
      setRating(userReview.rating);
    }
  }, [userReview]);

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
          {userReview ? (
            <p className="text-gray-600 text-sm mt-2">
              You’ve already submitted a review for this {media}.
            </p>
          ) : (
            <>
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

              <button
                className="cursor-pointer brown text-black font-medium shadow mt-3 py-2 px-6 rounded-sm transition"
                onClick={() => console.log("Post clicked!")}
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
