"use client";
import { useState } from "react";
import CommentList from "./CommentList";
import { useSession } from "next-auth/react";

export default function Review({ reviewId = 0, username= "Anonymous", text="No text available", currentUser = "Anonymous", removeReviewFromList = () => {}, votes = []}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  //CurrentUser should fetch the current user
  const { data: session } = useSession();
  const canEdit = session?.user?.name === username;

  const [commentText, setCommentText] = useState("");
  const onCommentTextChange = (e) => setCommentText(e.target.value);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh of comments
  
  //Reply logic
  const handleReply = async (commentText) => {
    console.log(`Replying to review ${reviewId} with comment: ${commentText}`);
    console.log(`User ID: ${session?.user?.id}`);
    // Implement reply submission logic here
    const res = await fetch(`/api/comments/under_review/${reviewId}/post_comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        review_id: reviewId,
        //user_id: session?.user?.id,
        comment_text: commentText,
        jwt_token: session?.accessToken,
        parent_comm_id: null // Since this is a reply to a review, not a comment
      }),
    });

    setShowReplyBox(false); // Close the reply box after submitting
    setRefreshKey((prev) => prev + 1); // Trigger refresh of comments
  };

  //Delete review logic
  const deleteReview = async () => {
    console.log(`Deleting review ${reviewId}`);
    try {
    const res = await fetch(`/api/reviews/delete/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jwt_token: session?.accessToken,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete review');
    }

    //Remove from the list of reviews
    removeReviewFromList(reviewId);

  } catch (error) {
    console.error(error.message);
  }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReply(commentText);
    setCommentText("");
  };

  return (
    <div className="flex flex-col mt-1">
      <div className="relative flex items-center border-1 shadow-xl rounded-sm p-3 mb-2">
        {/* Avatar circle */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 border-2 m-2 cursor-pointer shrink-0">
          {/*placeholder image*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        {/* Example review content */}
        <div className="flex flex-col mx-5 justify-between h-full grow">
          <div>
            <p className="underline underline-offset-4">{username}</p>
            <p className="mt-3 text-gray-700 text-sm">{text}</p>
          </div>

          {/* Rating controls */}
          <div className="flex items-center w-full mt-2 space-x-2">
            {/* # of ratings */}
            <p className="mr-3 text-sm text-gray-700">{votes[0]?.upvotes || 0}</p>
            {/* plus */}
            <button className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
            <p>|</p>
            <p className="text-sm text-gray-700">{votes[0]?.downvotes || 0}</p>

            {/* minus */}
            <button className="cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Reply button */}
        <button
          onClick={() => setShowReplyBox((prev) => !prev)}
          className="absolute bottom-2 right-3 text-sm underline underline-offset-3 cursor-pointer"
        >
          Reply
        </button>

        {/* Edit/Delete buttons (top right) */}
        {canEdit && (
          <div className="absolute top-2 right-3 flex space-x-3">
            <button className="cursor-pointer text-blue-600 hover:text-blue-800">
              Edit
            </button>
            <button className="cursor-pointer text-red-600 hover:text-red-800" onClick={deleteReview}>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Reply box */}
      {showReplyBox && (
        <form className="flex flex-col border h-35 rounded-md p-3 mb-2 shadow-xl w-7/8" onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your reply..."
            className="w-full border rounded-sm p-2 resize-none focus:outline-none"
            value={commentText}
            onChange={onCommentTextChange}
          />
          <button className="cursor-pointer self-end mt-2 border-1 px-6 py-2 rounded-md text-sm" 
          type="submit"
          style={{backgroundColor:"var(--color-brown)"}}>
            Post
          </button>
        </form>
      )}

      {/* Comments below review */}
      <div className="flex w-full">
        <CommentList parentId={reviewId} parentType="review" refreshKey={refreshKey}/> {/*Parent type is for if we ever add replies to comments */}
      </div>
    </div>
  );
}
