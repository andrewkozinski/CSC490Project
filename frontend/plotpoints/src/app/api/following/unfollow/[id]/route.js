export async function PUT(request, context) {
    const body = await request.json();
    const { follow_id, jwt_token } = body;

    const res = await fetch(`${process.env.API_URL}/follow/unfollow/${follow_id}?jwt_token=${encodeURIComponent(jwt_token)}`, {
        method: 'PUT',
    });
    if (!res.ok) {
        return new Response("Failed to unfollow user womp womp", { status: res.status });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}