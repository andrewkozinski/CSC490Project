//Gets all bookmarks for a specific user by their user ID
export async function GET(request, { params }) {
    const { user_id } = params;
    console.log("User ID received: ", user_id);
    console.log("Params received: ", params);

    const res = await fetch(`${process.env.API_URL}/bookmarks/all_bookmarks/user/${user_id}`, {
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