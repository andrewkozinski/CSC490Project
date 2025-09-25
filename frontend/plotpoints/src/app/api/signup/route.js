import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Call into backend
    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    //If response failed, return error message
    if (!response.ok) {
      return NextResponse.json({ error: data.detail || "Signup failed" }, { status: response.status });
    }
    //Response success happiness
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}