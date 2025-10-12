export async function GET(request, { params }) {
    const { query } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;

    //const apiUrl = `${process.env.API_URL}/search/all?query=${encodeURIComponent(query)}&page=${page}`;
    const apiUrl = `${process.env.API_URL}/search/all?query=${encodeURIComponent(query)}`;//no page at least for now, just simple call
    
    const res = await fetch(apiUrl);

    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch results" }), { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}