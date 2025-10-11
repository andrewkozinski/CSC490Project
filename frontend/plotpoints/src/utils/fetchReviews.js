const fetchReviews = async (mediaType, id, setReviews) => {
  try {
    const response = await fetch(`/api/reviews/get/by_type/${mediaType}/id/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }
    const data = await response.json();
    console.log("Fetched Reviews:", data);
    setReviews(data.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    setReviews([]);
  }
};
export default fetchReviews;