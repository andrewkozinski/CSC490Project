import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
	const review_id = params.id;
	const { jwt_token } = await request.json();

	const response = await fetch(`${process.env.BACKEND_URL}/comments/delete/${review_id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${jwt_token}`,
		},
		body: JSON.stringify({ jwt_token }),
	});

	if (!response.ok) {
		const error = await response.json();
		return NextResponse.json({ error: error.detail || 'Review not found' }, { status: 404 });
	}

	const data = await response.json();
	return NextResponse.json(data);
}
