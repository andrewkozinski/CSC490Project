export async function GET(request, { params }) {
    const { media_type, id } = params;

    const res = await fetch(`${process.env.API_URL}/reviews/by_media/${media_type}/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch reviews", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}