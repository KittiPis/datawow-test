import { NextResponse } from "next/server";

export async function POST(): Promise<Response> {

  try {
    const res = NextResponse.json(
      {
        success: true,
        code: 200,
      },
      {
        status: 200,
      }
    );

    const cookieOptions = [
      "token=",
      "HttpOnly",
      "SameSite=Strict",
      "Path=/",
      "Max-Age=0",
    ];

    if (
      process.env.NODE_ENV === "production" &&
      process.env.ENABLE_HTTPS === "true"
    ) {
      cookieOptions.push("Secure");
    }

    res.headers.set("Set-Cookie", cookieOptions.join("; "));

    return res;
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : "Unknown server error";

    return new Response(
      JSON.stringify({
        error: errMsg || "Internal Server Error",
        code: 500,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
