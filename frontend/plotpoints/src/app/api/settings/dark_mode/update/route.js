import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
//   const params_content = await params;
//   const review_id = params_content.id;
  const { dark_mode_setting, jwt_token } = await request.json();

  const response = await fetch(`${process.env.API_URL}/settings/dark_mode?dark_mode_setting=${encodeURIComponent(dark_mode_setting)}&jwt_token=${encodeURIComponent(jwt_token)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt_token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json({ error: error.detail || 'An error occurred, setting could not be updated.' }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data);
}