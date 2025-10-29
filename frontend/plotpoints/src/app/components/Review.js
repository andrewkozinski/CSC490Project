"use client";
import { useState, useEffect } from "react";
import CommentList from "./CommentList";
import { useSession } from "next-auth/react";
import {upvote, removeUpvote, downvote, removeDownvote, fetchUserVote} from '@/lib/votes.js';
import Star from "./Star";

export default function Review({ reviewId = 0, username= "Anonymous", text="No text available", currentUser = "Anonymous", removeReviewFromList = () => {}, votes = {}, rating=0}) {
  const [reviewText, setReviewText] = useState(text);
  const [showReplyBox, setShowReplyBox] = useState(false);
  //CurrentUser should fetch the current user
  const { data: session } = useSession();
  const canEdit = session?.user?.name === username;
  const jwtToken = session?.accessToken;

  const [commentText, setCommentText] = useState("");
  const onCommentTextChange = (e) => setCommentText(e.target.value);
  const [refreshKey, setRefreshKey] = useState(0); // Key to trigger refresh of comments

  const [showEditBox, setShowEditBox] = useState(false);
  const [editText, setEditText] = useState("");
  //Fetch user voting status
  useEffect(() => {
    const fetchVoteStatus = async () => {
      if (!jwtToken) {
        console.error("No JWT token found");
        return;
      }

      try {
        const data = await fetchUserVote(votes.vote_id, jwtToken);
        setUserVote(data);
        //console.log("Fetched user vote status for vote", votes.vote_id, ":", data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchVoteStatus();
  }, [session?.accessToken, votes.vote_id]);  

  //All the upvote/downvote logic
  const [upvotes, setUpvotes] = useState(votes.upvotes || 0);
  const [downvotes, setDownvotes] = useState(votes.downvotes || 0);

  //Track user upvote/downvote status to prevent multiple votes
  const [userVote, setUserVote] = useState(null); // null, 'up', 'down'

  const handleUpvote = async () => {
    try {
      if (userVote === "up") {
        // Remove upvote
        setUpvotes((prev) => prev - 1);
        setUserVote(null);
        removeUpvote(votes.vote_id, jwtToken);
      } else {
        setUpvotes((prev) => prev + 1);
        if (userVote === "down") {
          setDownvotes((prev) => prev - 1);
          removeDownvote(votes.vote_id, jwtToken);
        }
        setUserVote("up");
        upvote(votes.vote_id, jwtToken);
      }
    }
    catch (error) {
      console.error("Error handling upvote:", error.message);
    }
  }

  const handleDownvote = async () => {
    try {
      if (userVote === "down") {
        // Remove downvote
        setDownvotes((prev) => prev - 1);
        setUserVote(null);
        removeDownvote(votes.vote_id, jwtToken);
      } else {
        setDownvotes((prev) => prev + 1);
        if (userVote === "up") {
          setUpvotes((prev) => prev - 1);
          removeUpvote(votes.vote_id, jwtToken);
        }
        setUserVote("down");
        downvote(votes.vote_id, jwtToken);
      }
    }
    catch (error) {
      console.error("Error handling downvote:", error.message);
    }
  }
  
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

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    console.log(`Submitting edit for review ${reviewId} with text: ${editText}`);

    const res = await fetch(`/api/reviews/edit/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        review_text: editText,
        jwt_token: session?.accessToken,
      }),
    });
    const data = await res.json();

    if (!res.ok) {

      if(res.status === 401) {
        alert("Session Expired, please log in again.");
      }
      throw new Error(data.error || 'Failed to edit review');
    }

    //If here it was a success
    setShowEditBox(false);
    setReviewText(editText); //Update the reviews text to avoid unnecessary refresh
  };

  return (
    <div className="flex flex-col mt-1">
      <div className="relative flex items-center border-1 shadow-xl rounded-sm p-3 mb-2">
        {/* Avatar circle */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#b0e0e68f] border-2 m-2 cursor-pointer shrink-0">
          {/*placeholder image*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-8 h-8 text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        {/* Example review content */}
        <div className="flex flex-col mx-3 justify-between h-full grow">
          <div>
            <div className="flex flex-row">
              <p className="underline underline-offset-4 mr-3">{username}</p>
              <div className="flex flex-row justify-center mb-3">
                      {[...Array(5)].map((_, i) => {
                        const value = i + 1;
                        return (
                          <Star
                            key={value}
                            className={`w-6 h-6 ${
                            value <= rating
                              ? "fill-black stroke-neutral-950"
                              : "fill-transparent stroke-neutral-950"
                              }`}
                          />
                        );
                      })}
              </div>
            </div>
            {/* <p className="underline underline-offset-4">{username}</p> */}
            <p className="mt-1 text-black text-sm">{reviewText}</p>
          </div>

          {/* Rating controls */}
          <div className="flex items-center w-full mt-2 space-x-2">
            {/* # of ratings */}
            <p className="mr-3 text-sm text-black">{upvotes}</p>
            {/* plus */}
            <button className={`cursor-pointer hover: ${userVote === "up" ? "text-green-600" : ""}`} onClick={handleUpvote}>
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
            <p className="text-sm text-black">{downvotes}</p>

            {/* minus */}
            <button className={`cursor-pointer mr-2 ${userVote === "down" ? "text-red-600" : ""}`} onClick={handleDownvote}>
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
            <button
              className="cursor-pointer text-blue-600 hover:text-blue-800"
              onClick={() => setShowEditBox((prev) => !prev)}
            >
              Edit
            </button>
            <button className="cursor-pointer text-red-600 hover:text-red-800" onClick={deleteReview}>
              Delete
            </button>
          </div>
        )}
      </div>
      {showEditBox && (
        <form className="flex flex-col mt-2 mb-2">
          <div className="relative">
            <textarea
              className="w-full border rounded-sm p-2 resize-none focus:outline-none"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              placeholder="Write your edit here..."
              maxLength={200}
              rows={4}
            />
            <button
              type="submit"
              onClick={handleSubmitEdit}
              className="absolute bottom-2 right-2 px-4 py-1 brown rounded cursor-pointer border-1 text-sm"
            >
              Edit
            </button>
          </div>
        </form>
      )}

      {/* Reply box */}
      {showReplyBox && (
        <form className="flex flex-col border h-35 rounded-sm p-3 mb-2 shadow-xl w-7/8" onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your reply..."
            className="w-full border rounded-sm p-2 resize-none focus:outline-none"
            value={commentText}
            onChange={onCommentTextChange}
            maxLength={200}
          />
          <button className="cursor-pointer self-end shadow-xl mt-2 px-6 py-2 rounded-sm text-sm" 
          type="submit"
          style={{backgroundColor:"var(--color-brown)"}}>
            Reply
          </button>
        </form>
      )}

      {/* Comments below review */}
      <div className="flex w-full ml-27 mb-6">
        <CommentList parentId={reviewId} parentType="review" refreshKey={refreshKey}/> {/*Parent type is for if we ever add replies to comments */}
      </div>
    </div>
  );
}
