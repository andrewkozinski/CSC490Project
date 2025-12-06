export async function GET(request, { params }) {
    const { type } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    //const apiUrl = `${process.env.API_URL}/search/all?query=${encodeURIComponent(query)}&page=${page}`;
    const apiUrl = `${process.env.API_URL}/recommendations/${type}?user_id=${encodeURIComponent(userId)}`;
    
    const res = await fetch(apiUrl);

    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch recommendations results" }), { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { 
        status: 200,
        headers: {
            "Cache-Control": "public, max-age=60" // cache for 1 minute
        }
    });
}