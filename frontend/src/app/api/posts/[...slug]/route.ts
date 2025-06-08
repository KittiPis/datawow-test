import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { searchParams, pathname } = req.nextUrl;

    // ✂️ ตัด /api/posts ออก
    const extractedPath = pathname.replace(/^\/api\/posts/, "") || "/summary";

    // ✅ เช็กว่าเป็น summary หรือ my-posts
    const isSummary = extractedPath.startsWith("/summary");
    const isMyposts = extractedPath.startsWith("/my-posts");

    // ✅ ถ้าเข้าเงื่อนไข → ต่อ query string
    const shouldAppendQuery = isSummary || isMyposts;
    const queryString = shouldAppendQuery ? `?${searchParams.toString()}` : "";

    // ✅ สร้าง URL
    const url = `${process.env.URL_API_DATAWOW}/posts${extractedPath}${queryString}`;
    console.log("Final URL:", url);

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
    console.error("[GET /api/posts/[...slug]]", err);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
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

    // ดึง post ID จาก URL
    const postIdMatch = req.nextUrl.pathname.match(/\/api\/posts\/(\d+)/);
    const postId = postIdMatch?.[1];

    if (!postId) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    // เตรียม URL ไปยัง backend จริง
    const url = `${process.env.URL_API_DATAWOW}/posts/${postId}`;
    console.log("📦 PATCH to:", url);

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category_id, title, content }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[External API Error]", errorText);
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[PATCH /api/posts/[id]]", err);
    return NextResponse.json(
      { error: "Unexpected error while updating post" },
      { status: 500 }
    );
  }
}
