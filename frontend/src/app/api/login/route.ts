import jwt from "jsonwebtoken";

// ✅ ตั้งชื่อไม่ซ้ำกับของ jsonwebtoken
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
    //const response = await fetch(`${process.env.URL_API_MEDICINE}/user/login`, {
    const externalRes = await fetch(
      `${process.env.URL_API_DATAWOW}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }
    );

    if (!externalRes.ok) {
      console.log("externalRes :", externalRes);
      return new Response(JSON.stringify({ error: "Invalid username" }), {
        status: 401,
      });
    }

    console.log("externalRes :", process.env.URL_API_DATAWOW);

    const { access_token } = await externalRes.json();

    // ✅ decode & verify แล้ว check ว่าผลลัพธ์เป็น object
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string);

    if (typeof decoded !== "object" || !decoded || !("username" in decoded)) {
      return new Response(JSON.stringify({ error: "Invalid token payload" }), {
        status: 400,
      });
    }

    // ✅ cast แบบไม่ชน
    const user = decoded as unknown as UserPayload;

    // 🍪 set cookie และส่งข้อมูลกลับ
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
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
    });
  }
}
