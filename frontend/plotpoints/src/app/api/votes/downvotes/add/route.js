async function downvote(voteId, jwtToken) {
  const response = await fetch(`http://${process.env.API_URL}/votes/downvote/${voteId}?jwt_token=${jwtToken}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Upvote failed');
  }

  return await response.json();
}