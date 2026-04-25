import { NextRequest, NextResponse } from "next/server";

// PUT update comment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ comment_id: string }> },
) {
  try {
    const { comment_id } = await params;
    const body = await req.json();
    const { content, user_id } = body;

    const response = await fetch(
      `${process.env.API_URL}/posts/comments/${comment_id}?user_id=${user_id}`,
      {
        method: "PUT",
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

// DELETE comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ comment_id: string }> },
) {
  try {
    const { comment_id } = await params;
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const response = await fetch(
      `${process.env.API_URL}/posts/comments/${comment_id}?user_id=${user_id}`,
      { method: "DELETE" },
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
