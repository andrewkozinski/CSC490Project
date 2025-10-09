import { useState } from "react";
import Comment from "./Comment";

export default function CommentsList() {
  const [showComments, setShowComments] = useState(false);

  const comments = [
    { username: "Angry Dude", text: "I thought it was the best movie of all time." },
    { username: "Happy Chick", text: "Loved the soundtrack!" },
    { username: "Film Buff", text: "The cinematography was stunning!" },
  ];

  return (
    <div className="flex justify-between">
      <button
        className="text-blue-500 underline cursor-pointer"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? "Hide Comments -" : "Comments +"}
      </button>

      {showComments && (
        <div className="">
          {comments.length > 0 ? (
            comments.map((c, id) => (
              <Comment key={id} username={c.username} text={c.text} />
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No comments yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
