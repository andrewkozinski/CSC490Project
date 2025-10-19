import { NextResponse } from 'next/server';

export async function PUT(req) {
  console.log("PUT request received in /api/votes/upvotes");
  const body = await req.json();
  //console.log("Parsed body:", body);
  const { voteId, jwtToken } = body;
  console.log("voteId:", voteId);
  try {
    const backendRes = await fetch(`${process.env.API_URL}/votes/upvote/${voteId}?jwt_token=${jwtToken}`, {
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

export async function DELETE(req) {
  const { voteId, jwtToken } = await req.json();
  try {
    const backendRes = await fetch(`${process.env.API_URL}/votes/remove_upvote/${voteId}?jwt_token=${jwtToken}`, {
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