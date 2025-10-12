export async function GET(request, context) {
    const params = await context.params;
    const { id } = params; // id is the parent review_id

    console.log(`Fetching comments for review_id: ${id}`);

    const res = await fetch(`${process.env.API_URL}/comments/from_review/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch comments", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}