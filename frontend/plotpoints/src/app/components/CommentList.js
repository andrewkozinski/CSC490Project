import { useState, useEffect } from "react";
import Comment from "./Comment";

export default function CommentsList({reviewId = 0, parentId = 0, parentType = "review", refreshKey = 0}) {
  const [showComments, setShowComments] = useState(false);

 //test commments
 /*
  const comments = [
    { username: "Anonymous", text: "I thought it was the best movie of all time." },
    { username: "Happy Chick", text: "Loved the soundtrack!" },
    { username: "Film Buff", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the" },
  ];*/

  const [comments, setComments] = useState([]); 

  const removeCommentFromList = (commentId) => {
    console.log(`Removing comment ${commentId} from list`);
    setComments((prevComments) => prevComments.filter((c) => c.comm_id !== commentId));
  }

  // Fetch comments for the parent review
  useEffect(() => {
    const fetchComments = async () => {
      let url = "";
      
      //If we're getting replies to a review, this route
      if (parentType === "review") {
        url = `/api/comments/under_review/${parentId}`;
      } 
      //If we're getting replies to a comment, this route
      else if (parentType === "comment") {
        url = `/api/comments/under_comment/${parentId}`;
      } 
      //If somehow neither, return empty list
      else {
        setComments([]);
        return;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        console.log("Fetched Comments:", data);
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchComments();
  }, [parentId, refreshKey]);

  return (
    <div className="flex flex-col w-full">
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
                <Comment key={id} username={c.username} text={c.comm_text} reviewId={reviewId} commentId={c.comm_id} votes={c.votes[0]} userId={c.user_id} removeCommentFromList={removeCommentFromList}/>
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
