async function handleHttpError(response) {
  if (response.status === 401) {
    console.log("User not logged in or session expired");
    //Display a modal or toast notification here
    alert("Session expired, please sign in to continue.");
    throw new Error("JWT Error: Unauthorized");
  }
  else {
    throw new Error("HTTP Error: " + response.status);
  }
}

//Upvote stuff
export async function upvote(voteId, jwt_token) {
  const response = await fetch(`/api/votes/upvotes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`
    },
    body: JSON.stringify({ voteId, jwtToken: jwt_token }),
  });

  if (!response.ok) {
    handleHttpError(response);
  }

  return await response.json();
}

export async function removeUpvote(voteId, jwt_token) {
  const response = await fetch(`/api/votes/upvotes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`
    },
    body: JSON.stringify({ voteId, jwtToken: jwt_token }),
  });

  if (!response.ok) {
    handleHttpError(response);
  }

  return await response.json();
}

//Downvote stuff
export async function downvote(voteId, jwtToken) {
  const response = await fetch(`/api/votes/downvotes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({ voteId, jwtToken: jwtToken }),
  });

  if (!response.ok) {
    handleHttpError(response);
  }

  return await response.json();
}

export async function removeDownvote(voteId, jwt_token) {
  const response = await fetch(`/api/votes/downvotes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`
    },
    body: JSON.stringify({ voteId, jwtToken: jwt_token }),
  });

  if (!response.ok) {
    handleHttpError(response);
  }

  return await response.json();
}

//Fetch user voting status
export async function fetchUserVote(voteId, jwtToken) {
  if (voteId === undefined || !jwtToken) {
    throw new Error("Missing voteId or jwtToken. voteId: " + voteId + ", jwtToken: " + jwtToken);
  }

  try {
    const response = await fetch(`/api/votes/fetch_user_vote?vote_id=${voteId}&jwt_token=${jwtToken}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching user vote");
    }

    const data = await response.json();
    const user_vote = data.user_vote;
    if(user_vote === "U") {
      return "up";
    }
    else if(user_vote === "D") {
      return "down";
    }
    return user_vote; // null if no vote

  } catch (err) {
    console.error("Error in getUserVote:", err);
    throw err;
  }
}