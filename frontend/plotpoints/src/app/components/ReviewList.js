import Review from "./Review";

export default function Reviews() {
  // Example review data
  const reviewData = [
    { id: 1, username: "Anonymous", text: "Loved this movie, great pacing and visuals!" },
    { id: 2, username: "Film Buff", text: "Interesting concept but weak execution overall." },
    { id: 3, username: "Happy Viewer", text: "10/10 would recommend!" },
  ];

  return (
    <div className="flex flex-col">
      {reviewData.map((r) => (
        <Review key={r.id} username={r.username} text={r.text} />
      ))}
    </div>
  );
}
