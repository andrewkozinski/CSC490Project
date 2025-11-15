export async function GET() {
    try {
        const response = await fetch(`${process.env.API_URL}/tvshows/search/airing_today`);
        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: "Failed to fetch airing today TV shows" }),
                { status: response.status }
            );
        }
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            }
        });
    }
    catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Server error fetching airing today TV shows" }),
            { status: 500 }
        );
    }
}