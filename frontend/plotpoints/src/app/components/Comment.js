"use client";
import { useState, useEffect } from "react";
import {
  upvote,
  removeUpvote,
  downvote,
  removeDownvote,
  fetchUserVote,
} from "@/lib/votes.js";
import CommentList from "./CommentList.js";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { isBlocked } from "@/lib/blocking";
import "@/app/components/Header.css";
import { useSettings } from "../context/SettingsProvider";

export default function Comment({
  removeCommentFromList = () => {},
  username = "Anonymous",
  text = "No comment",
  currentUser = "Anonymous", // logged-in user
  reviewId = 0,
  commentId = 0,
  votes = {}, // stores vote id, upvotes, and downvotes for a comment
  userId = 0,
}) {
  const { data: session } = useSession();
  const jwtToken = session?.accessToken;
  const canEdit = session?.user?.name === username;
  const date = session;

  
  const [showEditBox, setShowEditBox] = useState(false);
  const [editText, setEditText] = useState("");


  const [commentText, setCommentText] = useState(text);
  const onCommentTextChange = (e) => setCommentText(e.target.value);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const [upvotes, setUpvotes] = useState(votes.upvotes || 0);
  const [downvotes, setDownvotes] = useState(votes.downvotes || 0);

  //Track user upvote/downvote status to prevent multiple votes
  const [userVote, setUserVote] = useState(null); // null, 'upvote', 'downvote'

  //For refreshing comments after reply
  const [refreshKey, setRefreshKey] = useState(0);

  const { darkMode: darkOn} = useSettings();

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
        console.log(
          "Fetched user vote status for vote",
          votes.vote_id,
          ":",
          data
        );
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
  };

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
  };

  //for reply fix
  const [replyInput, setReplyInput] = useState("");


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
        comment_text: replyInput,
        jwt_token: session?.accessToken,
        parent_comm_id: commentId,
      }),
    });

    setShowReplyBox(false); // Close the reply box after submitting
    setReplyInput(""); //Reset reply input
    setRefreshKey((prev) => prev + 1); // Trigger refresh of comments
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    console.log(`Submitting edit for review ${commentId} with text: ${editText}`);

    const res = await fetch(`/api/comments/edit/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        comment_text: editText,
        jwt_token: session?.accessToken,
      }),
    });
    const data = await res.json();

    if (!res.ok) {

      if(res.status === 401) {
        alert("Session Expired, please log in again.");
      }
      throw new Error(data.error || 'Failed to edit comment');
    }

    //If here it was a success
    setShowEditBox(false);
    setCommentText(editText); //Update the reviews text to avoid unnecessary refresh
  };

  //For profile pics
  const [profilePicture, setProfilePicture] = useState(
    "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg"
  );

  const deleteComment = async () => {
    console.log(`Deleting comment ${commentText}`);
    try {
    const res = await fetch(`/api/comments/delete/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jwt_token: session?.accessToken,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete comment');
    }
    //remove from commentList
    removeCommentFromList(commentId);

  } catch (error) {
    console.error(error.message);
  }
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profiles/get/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        setProfilePicture(
          data.profile_pic_url ||
            "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg"
        );
      } catch (err) {
        setProfilePicture(
          "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg"
        );
      }
    }

    if (userId) fetchProfile();
  }, [userId]);

  //For blocked users
  const currentUserId = session?.user?.id;
  const [isBlockedUser, setIsBlockedUser] = useState(false);

  useEffect(() => {
  if (!currentUserId || !jwtToken || userId === currentUserId) return;

  const fetchBlockedStatus = async () => {
    try {
      const data = await isBlocked(userId, currentUserId);
      setIsBlockedUser(data.is_blocked);
    } catch (err) {
      console.error("Error checking block status:", err);
    }
  };

  fetchBlockedStatus();
}, [userId, currentUserId, jwtToken]);


const displayUsername = isBlockedUser ? "Blocked User" : username;
const displayText = isBlockedUser ? "This message is from a blocked user" : commentText;



return (
  <div className="flex flex-col mt-1">
    <div className="relative flex items-center border-1 shadow-xl rounded-sm p-3 mb-2 max-w-3/4">

      {/* Avatar circle */}
      <div
        className="group flex items-center justify-center w-12 h-12 rounded-full bg-transparent border-2 m-2 cursor-pointer shrink-0 transition-transform duration-200 hover:scale-115"
        onClick={() => (window.location.href = `/profile/${userId}`)}
      >
        <Image
          src={profilePicture}
          title={displayUsername}
          alt="profile picture"
          width={50}
          height={50}
          className="rounded-full w-11 h-11"
          onClick={() => (window.location.href = `/profile/${userId}`)}
          onError={() =>
            setProfilePicture(
              "https://objectstorage.us-ashburn-1.oraclecloud.com/n/idmldn7fblfn/b/plotpoint-profile-pic/o/def_profile/Default_pfp.jpg"
            )
          }
        />
      </div>

      {/* Comment text */}
      <div className="flex flex-col mx-3">
        {/* Username and text */}
        <div>
          <p
            className="underline underline-offset-4 cursor-pointer mb-1"
            onClick={() => (window.location.href = `/profile/${userId}`)}>
            {displayUsername}
          </p>
          <p className={`text-sm 
            ${darkOn ? "text-[#F3E9DC]": "text-black"}`}>{displayText}</p>
        </div>
        {/* Rating controls under the text */}
        <div className="flex items-center w-full mt-2 space-x-2">
          <p className={`text-sm 
            ${darkOn ? "text-[#F3E9DC]": "text-black"}`}>{upvotes}</p>

          {/* plus */}
          <button
            className={`cursor-pointer ${
              userVote === "up" ? "text-green-600" : ""
            }`}
            onClick={handleUpvote}
          >
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

          <p className={`text-sm 
            ${darkOn ? "text-[#F3E9DC]": "text-black"}`}>{downvotes}</p>

          {/* minus */}
          <button
            className={`group cursor-pointer mr-2 ${
              userVote === "down" ? "text-red-600" : ""
            }`}
            onClick={handleDownvote}
          >
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
          <button className="cursor-pointer text-blue-600 hover:text-blue-800"
          onClick={() => setShowEditBox((prev) => !prev)}>
            Edit
          </button>
          <button className="cursor-pointer text-red-600 hover:text-red-800"
          onClick={deleteComment}>
            Delete
          </button>
        </div>
      )}
    </div>
    {showEditBox && (
        <form className="flex flex-col border h-35 rounded-sm p-3 mb-2 shadow-xl w-3/5">
          <textarea
            placeholder="Write your edit..."
            className="w-full border text-sm rounded-sm p-2 resize-none focus:outline-none"
            defaultValue={displayText}
            onChange={(e) => setEditText(e.target.value)}
            maxLength={200}
          />
          <button
            className="cursor-pointer self-end reply-btn brown shadow mt-3 px-6 py-2 rounded-md text-sm"
            type="submit"
            onClick={handleSubmitEdit}
          >
            Post
          </button>
        </form>
      )}
    {/* Reply box below comment */}
    {showReplyBox && (
      <form
        className="flex flex-col border h-35 rounded-sm p-3 mb-2 shadow-xl w-3/5"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Reply submitted:", displayText);
          handleReply(replyInput);
        }}
      >
        <textarea
          placeholder="Write your reply..."
          className="w-full border text-sm rounded-sm p-2 resize-none focus:outline-none"
          maxLength={200}
          //value={displayText}
          onChange={(e) => setReplyInput(e.target.value)}
        />
        <button
          className="cursor-pointer self-end reply-btn brown shadow mt-3 px-6 py-2 rounded-md text-sm"
          type="submit" 
        >
          Reply
        </button>
      </form>
    )}

    {/* Comments below comment */}
    <div className="flex max-w-8/9 ml-27 mb-6">
      <CommentList
        reviewId={reviewId}
        parentId={commentId}
        parentType="comment"
        refreshKey={refreshKey}
      />{" "}
      {/*Parent type is for if we ever add replies to comments */}
    </div>
  </div>
);

}