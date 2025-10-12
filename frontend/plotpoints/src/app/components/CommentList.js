import { useState, useEffect } from "react";
import Comment from "./Comment";

export default function CommentsList({parentId = 0, parentType = "review", refreshKey = 0}) {
  const [showComments, setShowComments] = useState(false);

 //test commments
 /*
  const comments = [
    { username: "Anonymous", text: "I thought it was the best movie of all time." },
    { username: "Happy Chick", text: "Loved the soundtrack!" },
    { username: "Film Buff", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the" },
  ];*/

  const [comments, setComments] = useState([]); 

  // Fetch comments for the parent review
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/under_review/${parentId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await res.json();
        console.log("Fetched Comments:", data);
        setComments(data.comments);
      }
      catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchComments();
  }, [parentId, refreshKey]);

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
                <Comment key={id} username={c.username} text={c.comm_text} />
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
