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

export const checkIfFavorited = async (mediaType, mediaId, userId) => {

  const res = await fetch(`/api/favorites/is_favorited/${mediaType}/${mediaId}?userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to check favorite');
  return body;
};

//Limit is optional, defaults to 3
//Change this value when you want to fetch more than 3 favorites
export const getFavoritesByUserId = async (userId, limit = 3) => {
  const res = await fetch(`/api/favorites/all_favorites/user/${userId}?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error || 'Failed to fetch bookmarks');
  return body;
};

//As the name implies, adds a bookmark for the given listId and jwtToken
//Will show an alert if the session is expired 
export async function addFavorite(mediaType, mediaId, jwtToken) {
  const response = await fetch(`/api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({ mediaType, mediaId, jwtToken: jwtToken }),
  });

  if (!response.ok) {
    handleHttpError(response);
  }

  return await response.json();
};

export async function removeFavorite(mediaType, mediaId, jwtToken) {
  const response = await fetch(`/api/favorites`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    },
    body: JSON.stringify({ mediaType, mediaId, jwtToken: jwtToken }),
  })
  if (!response.ok) {
    handleHttpError(response);
  }
  return await response.json();
};