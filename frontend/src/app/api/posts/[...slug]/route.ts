import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams, pathname } = req.nextUrl;

    const extractedPath = pathname.replace(/^\/api\/posts/, "") || "/summary";

    const isSummary = extractedPath.startsWith("/summary");
    const isMyposts =
      extractedPath.startsWith("/my-posts") ||
      extractedPath.startsWith("/my-posts-summary");

    const shouldAppendQuery = isSummary || isMyposts;
    const queryString = shouldAppendQuery ? `?${searchParams.toString()}` : "";

    const url = `${process.env.URL_API_DATAWOW}/posts${extractedPath}${queryString}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) throw new Error("Fetch failed");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch posts" + err },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category_id, title, content } = body;

    if (!category_id || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const postIdMatch = req.nextUrl.pathname.match(/\/api\/posts\/(\d+)/);
    const postId = postIdMatch?.[1];

    if (!postId) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const url = `${process.env.URL_API_DATAWOW}/posts/${postId}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category_id, title, content }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error while updating post" + err },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postIdMatch = req.nextUrl.pathname.match(/\/api\/posts\/(\d+)/);
    const postId = postIdMatch?.[1];

    if (!postId) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const url = `${process.env.URL_API_DATAWOW}/posts/${postId}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: "Failed to delete post" + errorText },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error while deleting post" + err },
      { status: 500 }
    );
  }
}
