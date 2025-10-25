export async function GET(request, context) {
    const params = await context.params;
    const { id } = params;

    console.log(`Fetching following for user id: ${id}`);

    const res = await fetch(`${process.env.API_URL}/follow/following/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch following list womp womp", { status: res.status });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Cache-Control": "max-age=60" /*Cached for one minute */ } });
}