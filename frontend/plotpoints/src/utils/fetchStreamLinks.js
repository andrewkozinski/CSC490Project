const fetchStreamLinks = async (mediaType, id) => {
    try {
        const res = await fetch(`${process.env.API_URL}/${mediaType}/${id}/streaming_links`);
        if (!res.ok) {
            throw new Error(`Failed to fetch streaming links for ${id}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export default fetchStreamLinks;