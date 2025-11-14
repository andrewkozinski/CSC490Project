import { NextResponse } from 'next/server';

export async function DELETE(request, context) {
    const params = await context.params;
    const comment_id = params.id;
    const { jwt_token } = await request.json();

    const response = await fetch(`${process.env.API_URL}/comments/delete/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt_token}`,
        },
        body: JSON.stringify({
            comment_id,
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
