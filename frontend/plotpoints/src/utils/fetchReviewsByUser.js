const fetchReviewsByUser = async (userId) => {
  try {
    const response = await fetch(`/api/reviews/get/recent_reviews/by_user/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user reviews");
    }
    const data = await response.json();
    return data.reviews;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return [];
  }
};
export default fetchReviewsByUser;