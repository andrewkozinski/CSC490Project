import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request) {
    const apiUrl = `${process.env.API_URL}/profiles/update_profile_picture`;

    const contentType = request.headers.get('content-type') || '';
    const buffer = await request.arrayBuffer();

    const res = await fetch(apiUrl, {
        method: 'PUT',
        headers: { 'content-type': contentType },
        body: Buffer.from(buffer),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => 'Upstream error');
        return new Response(text || "Failed to update profile picture", { status: res.status });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: 200,
    });
}