export async function GET(request, context) {
    const params = await context.params;
    const { id } = params;

    console.log(`Fetching user information for user id: ${id}`);

    const res = await fetch(`${process.env.API_URL}/profiles/get/user_information/?user_id=${encodeURIComponent(id)}`);
    if (!res.ok) {
        return new Response("Failed to fetch profile information womp womp", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200, /*headers: { "Cache-Control": "max-age=300" }*/ });
}