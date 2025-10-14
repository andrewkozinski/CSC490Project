async function downvote(voteId) {
  const response = await fetch(`http://${process.env.API_URL}/votes/downvote/${voteId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upvote failed');
  }

  return await response.json();
}