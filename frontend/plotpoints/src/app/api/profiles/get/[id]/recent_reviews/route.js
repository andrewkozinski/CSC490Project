export async function GET(request, context) {
    const params = await context.params;
    const { id } = params;

    console.log(`Fetching recent reviews for user id: ${id}`);

    const res = await fetch(`${process.env.API_URL}/reviews/get_recent_reviews/by_user/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch recent reviews womp womp", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, headers: { "Cache-Control": "max-age=60" /*Cached for one minute */ } });
}