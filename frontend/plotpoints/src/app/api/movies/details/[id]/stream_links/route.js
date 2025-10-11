export async function GET(request, { params }) {
    const { id } = await params;

    const res = await fetch(`${process.env.API_URL}/movies/${id}/streaming_links`);
    if (!res.ok) {
        return new Response("Failed to fetch movie streaming links", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });

}