import { NextRequest, NextResponse } from "next/server";

// GET comments
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ post_id: string }> },
) {
  try {
    const { post_id } = await params;
    const { searchParams } = new URL(req.url);
    const skip = searchParams.get("skip") ?? "0";
    const limit = searchParams.get("limit") ?? "10";

    const response = await fetch(
      `${process.env.API_URL}/posts/${post_id}/comments?skip=${skip}&limit=${limit}`,
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST create comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ post_id: string }> },
) {
  try {
    const { post_id } = await params;
    const body = await req.json();
    const { content, user_id } = body;

    const response = await fetch(
      `${process.env.API_URL}/posts/${post_id}/comments?user_id=${user_id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
