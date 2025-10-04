export async function GET(request, { params }) {
    const { id } = params;

    const res = await fetch(`${process.env.API_URL}/movies/${id}`);
    if (!res.ok) {
        return new Response("Failed to fetch movie details", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });

}