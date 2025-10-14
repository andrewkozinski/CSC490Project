import { NextResponse } from 'next/server';

export async function PUT(req) {
  const { voteId } = await req.json();
  try {
    const backendRes = await fetch(`${process.env.API_URL}/votes/downvote/${voteId}`, {
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
    return NextResponse.json({ error: 'Downvote failed' }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { voteId } = await req.json();
  try {
    const backendRes = await fetch(`${process.env.API_URL}/votes/remove_downvote/${voteId}`, {
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
    return NextResponse.json({ error: 'Remove downvote failed' }, { status: 500 });
  }
}