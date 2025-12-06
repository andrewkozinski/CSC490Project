export const getRecommendedMedia = async (mediaType, userId) => {
    const res = await fetch(`/api/recommendations/${mediaType}?userId=${encodeURIComponent(userId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch recommended media');
    }
    const data = await res.json();
    return data;
}

export const getRecommendedBooks = async (userId) => {
    return getRecommendedMedia('books', userId);
}

export const getRecommendedMovies = async (userId) => {
    return getRecommendedMedia('movies', userId);
}

export const getRecommendedTVShows = async (userId) => {
    return getRecommendedMedia('tvshows', userId);
}