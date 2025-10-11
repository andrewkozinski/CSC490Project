import { useState } from "react";
import Comment from "./Comment";

export default function CommentsList() {
  const [showComments, setShowComments] = useState(false);

 //test commments
  const comments = [
    { username: "Angry Dude", text: "I thought it was the best movie of all time." },
    { username: "Happy Chick", text: "Loved the soundtrack!" },
    { username: "Film Buff", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the" },
  ];

  return (
    <div className="flex flex-col w-max-full w-initial-3/4">
      <div>
        <button
          className="cursor-pointer"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "Hide Comments -" : "Comments +"}
        </button>
      </div>
      <div>
        {showComments && (
          <div>
            {comments.length > 0 ? (
              comments.map((c, id) => (
                <Comment key={id} username={c.username} text={c.text} />
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
