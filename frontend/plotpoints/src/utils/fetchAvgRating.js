const fetchAvgRating = async (mediaType, id, setAvgRating) => {
  try {
    const response = await fetch(`/api/reviews/avg_rating/${mediaType}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch average rating");
    }
    const data = await response.json();
    console.log("Fetched Average Rating:", data);
    setAvgRating(data.average_rating);
  } catch (error) {
    console.error("Error fetching average rating:", error);
    setAvgRating(0);
  }
};
export default fetchAvgRating;