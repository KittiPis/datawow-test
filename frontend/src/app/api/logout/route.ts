import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(_req: NextRequest): Promise<Response> {
  try {
    // ✅ สร้าง response JSON พร้อม status code
    const res = NextResponse.json(
      {
        success: true,
        code: 200
      },
      {
        status: 200
      }
    );

    // ✅ กำหนด cookie สำหรับลบ token ทิ้ง
    const cookieOptions = [
      'token=',
      'HttpOnly',
      'SameSite=Strict',
      'Path=/',
      'Max-Age=0'
    ];

    // ✅ เพิ่ม Secure เฉพาะเมื่อเปิด HTTPS ใน production
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.ENABLE_HTTPS === 'true'
    ) {
      cookieOptions.push('Secure');
    }

    res.headers.set('Set-Cookie', cookieOptions.join('; '));

    return res;
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : 'Unknown server error';

    return new Response(
      JSON.stringify({
        error: errMsg || 'Internal Server Error',
        code: 500
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
