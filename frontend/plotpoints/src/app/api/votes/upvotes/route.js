import { NextResponse } from 'next/server';

export async function PUT(req) {
  console.log("PUT request received in /api/votes/upvotes");
  const body = await req.json();
  //console.log("Parsed body:", body);
  const { voteId } = body;
  console.log("voteId:", voteId);
  try {
    const backendRes = await fetch(`${process.env.API_URL}/votes/upvote/${voteId}`, {
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
  const { voteId } = await req.json();
  try {
    const backendRes = await fetch(`${process.env.API_URL}/votes/remove_upvote/${voteId}`, {
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
    return NextResponse.json({ error: 'Remove upvote failed' }, { status: 500 });
  }
}