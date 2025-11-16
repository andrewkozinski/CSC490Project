export async function GET(request,{params}) {

    // const body = await request.json();
    // const { jwtToken } = body;
    const params_content = await params;
    const user_id = params_content.user_id;

    try {
        const backendRes = await fetch(`${process.env.API_URL}/notifications/user_id/${user_id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const backendData = await backendRes.json();

        if (!backendRes.ok) {
            return new Response(JSON.stringify({ error: backendData.detail }), { status: backendRes.status });
        }
        return new Response(JSON.stringify(backendData), { status: 200 });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch notifications' }), { status: error.status || 500 });
    }
}