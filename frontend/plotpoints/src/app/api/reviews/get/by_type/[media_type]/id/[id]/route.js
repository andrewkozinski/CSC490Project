export async function GET(request, context) {
    const params = await context.params;
    const { media_type, id } = params;

    console.log(`Fetching reviews for media_type: ${media_type}, id: ${id}`);

    const res = await fetch(`${process.env.API_URL}/reviews/by_media/${media_type}/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch reviews womp womp", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}