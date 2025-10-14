import { NextResponse } from 'next/server';

export async function PUT(req) {
  const { voteId } = await req.json();
  try {
    const backendRes = await fetch(`${process.env.API_URL}/upvote/${voteId}`, {
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
    const backendRes = await fetch(`${process.env.API_URL}/remove_upvote/${voteId}`, {
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