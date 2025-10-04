export async function GET(request, { params }) {
    const { id } = await params;

    const res = await fetch(`${process.env.API_URL}/books/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch book details", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });

}