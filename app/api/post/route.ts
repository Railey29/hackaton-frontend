import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL;

// GET all posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = searchParams.get("skip") ?? "0";
    const limit = searchParams.get("limit") ?? "20";
    const user_id = searchParams.get("user_id") ?? "";

    const url = `${process.env.API_URL}/posts/?skip=${skip}&limit=${limit}${user_id ? `&user_id=${user_id}` : ""}`;
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts." },
      { status: 500 },
    );
  }
}

// POST create post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, user_id } = body;

    const response = await fetch(
      `${process.env.API_URL}/posts?user_id=${user_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      },
    );

    const data = await response.json();
    console.log("Backend POST response:", data); // add this

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to create post." },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 201 }); // data.data should be the new post
  } catch (error) {
    console.log("POST error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
