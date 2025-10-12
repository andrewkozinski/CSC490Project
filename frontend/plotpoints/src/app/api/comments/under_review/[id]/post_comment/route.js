import { NextResponse } from "next/server";

export async function POST(request, context) {
    const body = await request.json();
    const { review_id, user_id, comment_text, jwt_token } = body;

    const res = await fetch(`${process.env.API_URL}/comments/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt_token}`,
        },
        body: JSON.stringify({
            review_id,
            user_id,
            comment_text
        }),
    });

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json({ error: errorData.detail || 'Failed to create comment' }, { status: res.status })
    }

    const data = await res.json();
    return NextResponse.json(data);

}