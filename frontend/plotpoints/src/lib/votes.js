//Upvote stuff
export async function upvote(voteId) {
  const response = await fetch(`/api/votes/upvotes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voteId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upvote failed');
  }

  return await response.json();
}

export async function removeUpvote(voteId) {
  const response = await fetch(`/api/votes/upvotes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voteId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Remove upvote failed');
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
    body: JSON.stringify({ voteId, jwtToken }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Downvote failed');
  }

  return await response.json();
}

export async function removeDownvote(voteId) {
  const response = await fetch(`/api/votes/downvotes`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voteId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Remove downvote failed');
  }

  return await response.json();
}

//Fetch user voting status
export async function fetchUserVote(voteId, jwtToken) {
  if (!voteId || !jwtToken) {
    throw new Error("Missing voteId or jwtToken");
  }

  try {
    const response = await fetch(`/api/votes/fetch_user_vote?vote_id=${voteId}&jwt_token=${jwtToken}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching user vote");
    }

    const data = await response.json();
    return data.user_vote;
  } catch (err) {
    console.error("Error in getUserVote:", err);
    throw err;
  }
}