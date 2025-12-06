export async function GET() {
    try {
        const response = await fetch(`${process.env.API_URL}/movies/search/upcoming`);
        if (!response.ok) {
            return new Response(
                JSON.stringify({ error: "Failed to fetch upcoming movies" }),
                { status: response.status }
            );
        }
        const data = await response.json();
        console.log(data);
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour, change this variable to adjust caching time
            }
        });
    }
    catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Server error fetching upcoming movies" }),
            { status: 500 }
        );
    }
}