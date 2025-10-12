export async function GET(request, { params }) {
    const { id } = await params;

    const res = await fetch(`${process.env.API_URL}/tvshows/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch TV show details", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Cache-Control": "public, max-age=3600" // cache for 1 hour
        }
    });

}