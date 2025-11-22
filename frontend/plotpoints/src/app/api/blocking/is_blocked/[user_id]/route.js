//Checks if a user has blocked another user, given the user id and the target user id
export async function GET(request, { params }) {
    const { user_id } = await params;
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('current_user_id');

    const isBlocked = await fetch(`${process.env.API_URL}/blocking/is_blocked/user_id/${user_id}?user_id=${targetUserId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(!isBlocked.ok) {
        return new Response(JSON.stringify({ error: "Failed to check block status" }), { status: isBlocked.status });
    }
    
    const data = await isBlocked.json();
    return new Response(JSON.stringify(data), { status: 200 });
}