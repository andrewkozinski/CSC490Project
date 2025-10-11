const fetchUserReview = (reviews, userId) => {
    if (!reviews || reviews.length === 0) {
        return null;
    }
    return reviews.find(review => review.userId === userId) || null;
}

export default fetchUserReview;