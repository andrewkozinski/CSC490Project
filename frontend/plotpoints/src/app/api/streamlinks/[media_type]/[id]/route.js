export async function GET(request, { params }) {
    const { media_type, id } = await params;

    const res = await fetch(`${process.env.API_URL}/${media_type}/${id}/streaming_links`);
    if (!res.ok) {
        return new Response(`Failed to fetch streaming links details for ${id}`, { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Cache-Control": "public, max-age=3600" // cache for 1 hour
        }
    });

}