import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log("POST request received in /api/favorites/route.js");
  const body = await req.json();
  //console.log("Parsed body:", body);
  const { mediaType, mediaId, jwtToken } = body;
  console.log("mediaType:", mediaType);
  console.log("mediaId:", mediaId);
  console.log("jwtToken:", jwtToken);
  try {
    const backendRes = await fetch(`${process.env.API_URL}/favorites/add/media_type/${mediaType}/media_id/${mediaId}?jwt_token=${jwtToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!backendRes.ok) {
      const error = await backendRes.json();
      return NextResponse.json({ error: error.detail }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Favorite failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const { mediaType, mediaId, jwtToken } = body;
  try {
    const backendRes = await fetch(`${process.env.API_URL}/favorites/remove/media_type/${mediaType}/media_id/${mediaId}?jwt_token=${jwtToken}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!backendRes.ok) {
      const error = await backendRes.json();
      return NextResponse.json({ error: error.detail }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Remove upvote failed' }, { status: 500 });
  }
}