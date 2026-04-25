import { NextRequest, NextResponse } from "next/server";

// PUT update post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ post_id: string }> },
) {
  try {
    const { post_id } = await params; // await muna
    const body = await req.json();
    const { content, user_id } = body;

    const response = await fetch(
      `${process.env.API_URL}/posts/${post_id}?user_id=${user_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to update post." },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ post_id: string }> },
) {
  try {
    const { post_id } = await params; // await muna
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    const response = await fetch(
      `${process.env.API_URL}/posts/${post_id}?user_id=${user_id}`,
      { method: "DELETE" },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || "Failed to delete post." },
        { status: response.status },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
