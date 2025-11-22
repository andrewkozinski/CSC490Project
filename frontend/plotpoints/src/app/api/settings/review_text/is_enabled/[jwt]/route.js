export async function GET(request, { params }) {
    const { jwt } = await params;
    // const { searchParams } = new URL(request.url);
    // const userId = searchParams.get("userId");

    const apiUrl = `${process.env.API_URL}/settings/review_text/is_enabled?jwt_token=${encodeURIComponent(jwt)}`;
    
    const res = await fetch(apiUrl);

    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Failed to fetch recommendations results" }), { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { 
        status: 200,
        headers: {
            // "Cache-Control": "public, max-age=60" // cache for 1 minute
        }
    });
}