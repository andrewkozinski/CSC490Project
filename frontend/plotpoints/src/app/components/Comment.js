"use client";
import { useState, useEffect } from "react";
import {upvote, removeUpvote, downvote, removeDownvote, fetchUserVote} from '@/lib/votes.js';
import { useSession } from "next-auth/react";

export default function Comment({
  username = "Anonymous",
  text = "No comment",
  currentUser = "Anonymous", // logged-in user
  reviewId = 0,
  commentId = 0,
  votes = {}, // stores vote id, upvotes, and downvotes for a comment
}) {
  const { data: session } = useSession();
  const jwtToken = session?.accessToken;
  const canEdit = currentUser === username;

  const [commentText, setCommentText] = useState("");
  const onCommentTextChange = (e) => setCommentText(e.target.value);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const [upvotes, setUpvotes] = useState(votes.upvotes || 0);
  const [downvotes, setDownvotes] = useState(votes.downvotes || 0);

  //Track user upvote/downvote status to prevent multiple votes
  const [userVote, setUserVote] = useState(null); // null, 'upvote', 'downvote'

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
        console.log("Fetched user vote status for vote", votes.vote_id, ":", data);
        //console.log("Fetched user vote status for vote", votes.vote_id, ":", data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchVoteStatus();
  }, [session?.accessToken, votes.vote_id]);  

  const handleUpvote = async () => {
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

  const handleDownvote = async () => {
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

  return (
    <div className="flex flex-col relative">
      <div className="relative flex border-1 shadow-xl rounded-sm m-1 p-3 h-28 max-w-3/4">
        {/* Avatar and Text */}
        <div className="flex items-start">
          {/* Avatar circle */}
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 border-2 m-2 cursor-pointer mr-5 shrink-0">
            {/* placeholder */}
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

          <div>
            <p className="underline underline-offset-4 mb-2">{username}</p>
            <p className="text-sm text-gray-700">{text}</p>
          </div>
        </div>

        {/* Top-right Edit/Delete buttons */}
        {canEdit && (
          <div className="absolute top-2 right-3 flex items-center">
            <button className="cursor-pointer text-blue-600 hover:text-blue-800">
              Edit
            </button>
            <button className="cursor-pointer ml-3 text-red-600 hover:text-red-800">
              Delete
            </button>
          </div>
        )}

        {/* Bottom-right rating controls */}
        <div className="absolute bottom-2 right-4 flex items-center space-x-2">
          {/* # of ratings */}
          <p className="text-sm text-gray-700">{upvotes}</p>

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
          <p className="ml-3 text-sm text-gray-700">{downvotes}</p>

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
          <div>
            {/* Reply button */}
            <button
              onClick={() => setShowReplyBox((prev) => !prev)}
              className="text-sm underline underline-offset-3 cursor-pointer"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      <div>
        {showReplyBox && (
          <form
            className="flex flex-col border h-35 rounded-sm max-w-3/5 p-3 mb-2 ml-1 mt-2 shadow-xl"
            onSubmit={(e) => {
              e.preventDefault(); // prevent page reload
              console.log("click");
              console.log("Reply submitted:", commentText);
            }}
          >
            <textarea
              placeholder="Write your reply..."
              className="w-full border rounded-sm p-2 resize-none focus:outline-none"
              value={commentText}
              onChange={onCommentTextChange}
            />
            <button
              className="cursor-pointer self-end mt-2 shadow px-6 py-2 rounded-sm text-sm"
              type="submit"
              style={{ backgroundColor: "var(--color-brown)" }}
            >
              Reply
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
