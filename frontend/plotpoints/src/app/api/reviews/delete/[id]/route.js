import { NextResponse } from 'next/server';

export async function DELETE(request, context) {
	const params = await context.params;
    const review_id = params.id;
	const { jwt_token } = await request.json();

	const response = await fetch(`${process.env.API_URL}/reviews/delete/${review_id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${jwt_token}`,
		},
		body: JSON.stringify({
			review_id,
			jwt_token 
		}),
	});

	if (!response.ok) {
		const error = await response.json();
		return NextResponse.json({ error: error.detail || 'Review not found' }, { status: 404 });
	}

	const data = await response.json();
	return NextResponse.json(data);
}
