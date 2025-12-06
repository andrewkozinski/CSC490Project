import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request, context) {
    const body = await request.json();
    const { new_bio, jwt_token } = body;

    const res = await fetch(`${process.env.API_URL}/profiles/update_bio?new_bio=${encodeURIComponent(new_bio)}&jwt_token=${encodeURIComponent(jwt_token)}`, {
        method: 'PUT',
    });
    if (!res.ok) {
        return new Response("Failed to update bio womp womp", { status: 500 });
    }
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
}