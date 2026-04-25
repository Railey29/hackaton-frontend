import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ post_id: string }> },
) {
  try {
    const { post_id } = await params;
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const response = await fetch(
      `${process.env.API_URL}/posts/${post_id}/hide?user_id=${user_id}`,
      { method: "POST" },
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
