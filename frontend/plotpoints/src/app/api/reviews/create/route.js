import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, media_id, media_type, rating, review_text, jwt_token } = body

    const res = await fetch(`${process.env.BACKEND_URL}/reviews/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify({
        user_id,
        media_id,
        media_type,
        rating,
        review_text,
        jwt_token,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return NextResponse.json({ error: errorData.detail || 'Failed to create review' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}