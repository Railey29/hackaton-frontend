// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.message || "Login failed" },
        { status: response.status }
      );
    }

    // Transform the response to have token at root level
    // Backend returns: { success: true, message: "...", data: { user_id, nickname, username, token } }
    if (data.success && data.data?.token) {
      return NextResponse.json(
        {
          token: data.data.token,
          user_id: data.data.user_id,
          nickname: data.data.nickname,
          username: data.data.username,
        },
        { status: 200 }
      );
    }

    // Fallback: return original data
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}