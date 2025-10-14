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
export async function downvote(voteId) {
  const response = await fetch(`/api/votes/downvotes`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ voteId }),
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
