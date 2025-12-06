//Checks if a specific item is bookmarked by the user, given the user id and bookmark id
export async function GET(request, { params }) {
    const { media_type, media_id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // console.log("USER ID IN IS_BOOKMARKED ROUTE:", userId);
    // console.log("MEDIA TYPE IN IS_BOOKMARKED ROUTE:", media_type);
    // console.log("MEDIA ID IN IS_BOOKMARKED ROUTE:", media_id);

    const isBookmarked = await fetch(`${process.env.API_URL}/bookmarks/is_bookmarked/media_type/${media_type}/media_id/${media_id}?user_id=${userId}`, {
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