import { NextRequest, NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const voteId = searchParams.get("vote_id");
  const jwtToken = searchParams.get("jwt_token");

  if (!voteId || !jwtToken) {
    return NextResponse.json({ error: "Missing vote_id or jwt_token" }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.API_URL}/votes/get_user_vote/${voteId}?jwt_token=${jwtToken}`);
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.detail || "Error fetching user vote status" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error calling the backend:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}