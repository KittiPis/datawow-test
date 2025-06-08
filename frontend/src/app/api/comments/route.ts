import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    // ❗ หากไม่มี token → รีเทิร์น 401
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: missing token" },
        { status: 401 }
      );
    }

    // ✅ ดึง body ที่ส่งเข้ามา
    const body = await req.json();
    const { post_id, content } = body;

    // ✅ ตรวจสอบข้อมูลเบื้องต้น
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
      const errorText = await res.text();
      console.error("[External API Error]", errorText);
      return NextResponse.json(
        { error: "Failed to post comment" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[POST /api/comments]", err);
    return NextResponse.json(
      { error: "Unexpected error while posting comment" },
      { status: 500 }
    );
  }
}
