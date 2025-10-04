export async function GET(req, context) {
  const { genre } = await context.params; // Get genre from URL params

  try {
    const response = await fetch(`${process.env.API_URL}/books/search/genre/${genre}`);
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch books of the "${genre}" genre/category` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Server error fetching books" }),
      { status: 500 }
    );
  }
}