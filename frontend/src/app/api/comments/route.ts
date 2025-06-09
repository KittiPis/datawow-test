import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: missing token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { post_id, content } = body;

    if (!post_id || !content || typeof content !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid post_id or content" },
        { status: 400 }
      );
    }

    const url = `${process.env.URL_API_DATAWOW}/comments`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ post_id, content }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to post comment" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error while posting comment" + err },
      { status: 500 }
    );
  }
}
