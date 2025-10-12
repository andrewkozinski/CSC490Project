import Review from "./Review";

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

  if(reviewData.length === 0) {
    return <p>No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="flex flex-col">
      {reviewData.map((r) => (
        <Review key={r.review_id} reviewId={r.review_id} username={r.username} text={r.review_text} />
      ))}
    </div>
  );
}
