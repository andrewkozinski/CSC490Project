import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
    const { user_id } = await params;
    console.log("Blocking user ID received: ", user_id);
    const body = await request.json();
    const { jwt_token } = body;
    console.log("Block request for user ID: ", user_id);

    const apiUrl = `${process.env.API_URL}/blocking/unblock/user_id/${encodeURIComponent(user_id)}?jwt_token=${encodeURIComponent(jwt_token)}`;

    try {

        const res = await fetch(apiUrl, {
            method: 'POST',
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.detail || 'Failed to unblock user' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    }
    catch (error) {
        console.error('Error blocking user:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}