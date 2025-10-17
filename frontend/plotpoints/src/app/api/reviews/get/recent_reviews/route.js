export async function GET(request) {

    const res = await fetch(`${process.env.API_URL}/reviews/get_recent_reviews`);
    if (!res.ok) {
        return new Response("Failed to fetch recent reviews", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}