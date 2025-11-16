import { NextResponse } from 'next/server';

export async function PUT(req) {
  console.log("PUT request received in /api/notifications/read");
  const body = await req.json();
  //console.log("Parsed body:", body);
  const { notiId, jwtToken } = body;
  console.log("notiId:", notiId);
  try {
    const backendRes = await fetch(`${process.env.API_URL}/notifications/read/${notiId}?jwt_token=${jwtToken}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!backendRes.ok) {
      const error = await backendRes.json();
      return NextResponse.json({ error: error.detail }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Upvote failed' }, { status: 500 });
  }
}