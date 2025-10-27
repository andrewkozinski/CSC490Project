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

export const isBookmarked = async (bookmarkId, userId) => {
    const res = await fetch(`/api/bookmarks/get/is_bookmarked/${bookmarkId}?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to check bookmark');
    return body;
};

export const getBookmarksByUserId = async (userId) => {
    const res = await fetch(`/api/bookmarks/get/bookmarks_by_user_id/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || 'Failed to fetch bookmarks');
    return body;
};