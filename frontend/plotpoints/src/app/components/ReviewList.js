"use client";
import Review from "./Review";
import { useState, useEffect } from "react";

export default function Reviews({ reviewData = [] }) {

  const [sortOrder, setSortOrder] = useState(""); // "" means no sorting

  // Example review data
  /*
  reviewData = [
    { id: 1, username: "Anonymous", text: "Loved this movie, great pacing and visuals!" },
    { id: 2, username: "Film Buff", text: "Interesting concept but weak execution overall." },
    { id: 3, username: "Happy Viewer", text: "10/10 would recommend!" },
  ];*/

  //Example response from backend:
  /*
  {
      "review_id": 1,
      "user_id": 12,
      "media_id": 1038392,
      "media_type": "movie",
      "rating": 1,
      "review_text": "i hate this movie!",
      "username": "jsieb"
    }
  */

  //State to rerender the list when a review is deleted
  // State to rerender the list when a review is deleted
  const [reviews, setReviews] = useState(reviewData);
  useEffect(() => {
    setReviews(reviewData);
  }, [reviewData]);

  // Sorting logic after reviews is declared
  const sortedReviews = sortOrder
    ? [...reviews].sort((a, b) =>
      sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
    )
    : reviews;


  if (reviews.length === 0) {
    return <p>No reviews yet. Be the first to review!</p>;
  }

  const removeReviewFromList = (reviewId) => {
    console.log(`Removing review ${reviewId} from list`);
    setReviews((prevReviews) => prevReviews.filter((r) => r.review_id !== reviewId));
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium">Reviews ({reviews.length})</p>
        <select
          className="px-2 py-1 border rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Rating</option>
          <option value="asc">Ascending (1 → 5)</option>
          <option value="desc">Descending (5 → 1)</option>
        </select>
      </div>

      {sortedReviews.map((r) => (<Review key={r.review_id} userId={r.user_id} reviewId={r.review_id} username={r.username} text={r.review_text} removeReviewFromList={removeReviewFromList} votes={r.votes[0]} rating={r.rating} />
      ))}
    </div>
  );
}
