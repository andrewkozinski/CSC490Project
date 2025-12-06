import { NextResponse } from 'next/server';

export async function DELETE(request, context) {
    const params = await context.params;
    const { jwt_token } = await request.json();

    const response = await fetch(`${process.env.API_URL}/auth/delete_account?jwt_token=${jwt_token}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt_token}`,
        },
        body: JSON.stringify({
            jwt_token 
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        return NextResponse.json({ error: error.detail || 'Error deleting account occurred' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
}
