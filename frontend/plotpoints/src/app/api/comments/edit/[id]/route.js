import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  const params_content = await params;
  const comment_id = params_content.id;
  const { comment_text, jwt_token } = await request.json();

  const response = await fetch(`${process.env.API_URL}/comments/edit/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`,
    },
    body: JSON.stringify({ comment_id, new_comment_text: comment_text, jwt_token }),
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json({ error: error.detail || 'An error occurred, review not found.' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}