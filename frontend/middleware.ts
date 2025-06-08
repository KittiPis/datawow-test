import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment')
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/our-blog')) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET)

      if (typeof decoded !== 'object' || !decoded || !('username' in decoded)) {
        throw new Error('Invalid token structure')
      }

      return NextResponse.next()
    } catch (err) {
      console.error('JWT verify failed:', err)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/our-blog/:path*'],
}
