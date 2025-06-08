import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const url = `${process.env.URL_API_DATAWOW}/masters/categories`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch posts from external API");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
