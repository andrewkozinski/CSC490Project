const fetchStreamLinks = async (mediaType, id, setStreamLinks) => {
    try {
        const res = await fetch(`/api/streamlinks/${mediaType}/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch streaming links for ${id}`);
        }
        const data = await res.json();

        // Only keep flatrate, if no flatrate then set to just empty array
        const flatrateLinks = Array.isArray(data.flatrate) ? data.flatrate : [];
        setStreamLinks(flatrateLinks);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}
export default fetchStreamLinks;