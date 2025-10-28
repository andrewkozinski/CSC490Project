export async function GET(request) {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');

    const res = await fetch(`${process.env.API_URL}/reviews/get_recent_reviews?limit=${limit}`);
    if (!res.ok) {
        return new Response("Failed to fetch recent reviews", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, /*headers: { "Cache-Control": "max-age=60"*/ } /*Cached for one minute */ });
}