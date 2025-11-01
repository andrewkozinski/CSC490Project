//Checks if a specific item is bookmarked by the user, given the user id and bookmark id
export async function GET(request, { params }) {
    const { mediaType, mediaId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const isBookmarked = await fetch(`${process.env.API_URL}/bookmarks/is_bookmarked/media_type/${mediaType}/media_id/${mediaId}?user_id=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(!isBookmarked.ok) {
        return new Response(JSON.stringify({ error: "Failed to check bookmark status" }), { status: isBookmarked.status });
    }
    
    const data = await isBookmarked.json();
    return new Response(JSON.stringify(data), { status: 200 });
}