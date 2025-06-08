import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: missing token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { category_id, title, content } = body;

    console.log("📦 Received:", category_id, title, content);

    if (
      !category_id ||
      typeof category_id !== "number" ||
      !title ||
      typeof title !== "string" ||
      !content ||
      typeof content !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid category_id, title, or content" },
        { status: 400 }
      );
    }

    if (title.trim().length < 3) {
      return NextResponse.json(
        { error: "Title must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (content.trim().length < 10) {
      return NextResponse.json(
        { error: "Content must be at least 10 characters." },
        { status: 400 }
      );
    }

    const url = `${process.env.URL_API_DATAWOW}/posts`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category_id, title, content }),
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        console.error("[External API Error]", errorData);
        return NextResponse.json(
          { error: "Failed to create post", details: errorData },
          { status: res.status }
        );
      } catch {
        const fallback = await res.text();
        console.error("[External API Raw Error]", fallback);
        return NextResponse.json(
          { error: "Failed to create post", raw: fallback },
          { status: res.status }
        );
      }
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/posts]", err);
    return NextResponse.json(
      { error: "Unexpected error while creating post" },
      { status: 500 }
    );
  }
}
