export async function POST(request, context) {
    const body = await request.json();

    const res = await fetch(`${process.env.API_URL}/comments/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        return new Response("Failed to create comment", { status: 500 });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}