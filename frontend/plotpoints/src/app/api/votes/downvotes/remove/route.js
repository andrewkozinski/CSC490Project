async function removeDownvote(voteId) {
  const response = await fetch(`http://${process.env.API_URL}/votes/remove_downvote/${voteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Remove downvote failed');
  }

  return await response.json();
}