//Gets all bookmarks for a specific user by their user ID
export async function GET(request, { params }) {
    const { user_id } = await params;
    console.log("User ID received: ", user_id);
    //Get number of bookmarks to fetch from url query, default to 10 if not provided
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 10;

    const res = await fetch(`${process.env.API_URL}/bookmarks/all_bookmarks/user/${user_id}?limit=${limit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to get bookmarks for user " + user_id }), { status: res.status });
    }
    
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}