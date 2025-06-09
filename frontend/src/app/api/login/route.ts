import jwt from "jsonwebtoken";

interface UserPayload {
  sub: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    const externalRes = await fetch(
      `${process.env.URL_API_DATAWOW}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }
    );

    if (!externalRes.ok) {
      return new Response(JSON.stringify({ error: "Invalid username" }), {
        status: 401,
      });
    }

    const { access_token } = await externalRes.json();

    const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string);

    if (typeof decoded !== "object" || !decoded || !("username" in decoded)) {
      return new Response(JSON.stringify({ error: "Invalid token payload" }), {
        status: 400,
      });
    }

    const user = decoded as unknown as UserPayload;

    const res = new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.sub,
          username: user.username,
          role: user.role,
        },
      })
    );

    res.headers.set(
      "Set-Cookie",
      `token=${access_token}; HttpOnly; Path=/; Max-Age=${
        user.exp - user.iat
      }; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure;" : ""
      }`
    );

    return res;
  } catch (err) {
    return new Response(JSON.stringify({ error: "Login failed" + err }), {
      status: 500,
    });
  }
}
