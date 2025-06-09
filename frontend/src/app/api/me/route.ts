import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

interface DecodedToken {
  exp: number;
  username: string;
  [key: string]: unknown;
}

interface JsonResponseData {
  expired: boolean;
  username?: string;
  reason?: string;
}

export async function GET(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return jsonResponse({ expired: true, reason: "No token found" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return jsonResponse({ expired: true, reason: "No secret provided" });
    }

    try {
      const decoded = jwt.verify(token, secret) as DecodedToken;
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = decoded.exp < currentTime;

      return jsonResponse({
        expired: isExpired,
        username: decoded.username,
      });
    } catch {
      return jsonResponse({
        expired: true,
        reason: "Invalid or expired token",
      });
    }
  } catch {
    return jsonResponse({ expired: true, reason: "Server error" });
  }
}

function jsonResponse(data: JsonResponseData): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
