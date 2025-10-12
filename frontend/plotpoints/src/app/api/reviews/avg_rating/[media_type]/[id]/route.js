export async function GET(request, context) {
    const params = await context.params;
    const { media_type, id } = params;

    console.log(`Fetching average rating for media_type: ${media_type}, id: ${id}`);

    const res = await fetch(`${process.env.API_URL}/${media_type}/${id}/average_rating`);
    if (!res.ok) {
        return new Response("Failed to fetch average rating", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}