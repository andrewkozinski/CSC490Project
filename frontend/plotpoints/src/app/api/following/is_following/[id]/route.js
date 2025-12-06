export async function GET(request, context) {
    const params = await context.params;
    const {id} = params;
    //console.log(`Checking if following user id: ${id}`);
    const { searchParams } = new URL(request.url);
    const jwt_token = searchParams.get('jwt_token');
    //console.log(`Using JWT token: ${jwt_token}`);

    const res = await fetch(`${process.env.API_URL}/follow/is_following/${id}?jwt_token=${encodeURIComponent(jwt_token)}`, {
        method: 'GET',
    });
    if (!res.ok) {
        return new Response("Failed to check if following user womp womp", { status: res.status });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}