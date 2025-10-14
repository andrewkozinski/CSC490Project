"use client";
import Review from "./Review";
import { useState, useEffect } from "react";

export default function Reviews({ reviewData = [] }) {
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
  const [reviews, setReviews] = useState(reviewData);
  useEffect(() => {
    setReviews(reviewData);
  }, [reviewData]);

  if(reviews.length === 0) {
    return <p>No reviews yet. Be the first to review!</p>;
  }

  const removeReviewFromList = (reviewId) => {
    console.log(`Removing review ${reviewId} from list`);
    setReviews((prevReviews) => prevReviews.filter((r) => r.review_id !== reviewId));
  }

  return (
    <div className="flex flex-col">
      {reviews.map((r) => (
        <Review key={r.review_id} reviewId={r.review_id} username={r.username} text={r.review_text} removeReviewFromList={removeReviewFromList} votes={r.votes[0]}/>
      ))}
    </div>
  );
}
