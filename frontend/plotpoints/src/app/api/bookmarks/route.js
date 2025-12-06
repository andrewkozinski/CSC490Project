import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log("POST request received in /api/bookmarks/route.js");
  const body = await req.json();
  //console.log("Parsed body:", body);
  const { mediaType, mediaId, jwtToken } = body;
  console.log("mediaType:", mediaType);
  console.log("mediaId:", mediaId);
  console.log("jwtToken:", jwtToken);
  try {
    const backendRes = await fetch(`${process.env.API_URL}/bookmarks/add/media_type/${mediaType}/media_id/${mediaId}?jwt_token=${jwtToken}`, {
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
    return NextResponse.json({ error: 'Bookmark failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const { mediaType, mediaId, jwtToken } = body;
  try {
    const backendRes = await fetch(`${process.env.API_URL}/bookmarks/remove/media_type/${mediaType}/media_id/${mediaId}?jwt_token=${jwtToken}`, {
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
    return NextResponse.json({ error: 'Remove bookmark failed' }, { status: 500 });
  }
}