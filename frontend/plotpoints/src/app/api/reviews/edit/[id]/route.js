import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const review_id = params.id;
  const { review_text, jwt_token } = await request.json();

  const response = await fetch(`${process.env.API_URL}/edit/${review_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`,
    },
    body: JSON.stringify({ review_text, jwt_token }),
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json({ error: error.detail || 'An error occurred, review not found.' }, { status: 404 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}