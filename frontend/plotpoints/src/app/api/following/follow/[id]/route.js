export async function POST(request, context) {
    const body = await request.json();
    const { follow_id, jwt_token } = body;

    console.log(`Following user id: ${follow_id} with token: ${jwt_token}`);

    const res = await fetch(`${process.env.API_URL}/follow/follow/${follow_id}?jwt_token=${encodeURIComponent(jwt_token)}`, {
        method: 'POST',
    });
    if (!res.ok) {
        return new Response("Failed to follow user womp womp", { status: res.status });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}