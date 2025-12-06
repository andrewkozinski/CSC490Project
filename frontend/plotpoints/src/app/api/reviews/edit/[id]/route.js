import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const params_content = await params;
  const review_id = params_content.id;
  const { review_text, jwt_token } = await request.json();

  const response = await fetch(`${process.env.API_URL}/reviews/edit/${review_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`,
    },
    body: JSON.stringify({ review_id, review_text, jwt_token }),
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json({ error: error.detail || 'An error occurred, review not found.' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}