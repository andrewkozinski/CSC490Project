async function removeUpvote(voteId) {
  const response = await fetch(`http://${process.env.API_URL}/votes/remove_upvote/${voteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Remove upvote failed');
  }

  return await response.json();
}