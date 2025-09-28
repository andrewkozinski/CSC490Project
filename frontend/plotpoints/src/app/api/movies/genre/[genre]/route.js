export async function GET(req, context) {
  const { genre } = await context.params; // Get genre from URL params

  try {
    const response = await fetch(`${process.env.API_URL}/movies/search/genre/${genre}`);
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch movies of the "${genre}" genre` }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Server error fetching movies" }),
      { status: 500 }
    );
  }
}