import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!)
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public paths
  if (pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Cron routes verified by cron secret, not session
  if (pathname.startsWith('/api/cron')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const { payload } = await jwtVerify(token, getSecret())

    // Admin-only routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (!payload.is_admin) {
        return NextResponse.redirect(new URL('/bracket', req.url))
      }
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
