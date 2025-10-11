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
      "review_id": 2,
      "user_id": 5,
      "media_id": 81,
      "media_type": "book",
      "rating": 3,
      "review_text": "It truly is one of the islands of all time"
    }
  */

  if(reviewData.length === 0) {
    return <p>No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="flex flex-col">
      {reviewData.map((r) => (
        <Review key={r.review_id} username={r.user_id} text={r.review_text} />
      ))}
    </div>
  );
}
