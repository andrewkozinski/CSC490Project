import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log("POST request received in /api/bookmarks/route.js");
  const body = await req.json();
  //console.log("Parsed body:", body);
  const { listId, jwtToken } = body;
  console.log("listId:", listId);
  console.log("jwtToken:", jwtToken);
  try {
    const backendRes = await fetch(`${process.env.API_URL}/bookmarks/add/${listId}?jwt_token=${jwtToken}`, {
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
    return NextResponse.json({ error: 'Upvote failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const body = await req.json();
  const { listId, jwtToken } = body;
  try {
    const backendRes = await fetch(`${process.env.API_URL}/bookmarks/remove/${listId}?jwt_token=${jwtToken}`, {
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