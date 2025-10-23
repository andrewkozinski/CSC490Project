const fetchUserReview = (reviews, userId) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }
    return reviews.find(review => review.user_id === userId) || null;
}

export default fetchUserReview;