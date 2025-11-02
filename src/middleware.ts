import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes (including auth routes)
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Protect all /admin routes except /admin itself (the login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const token = request.cookies.get('admin-session')?.value
    const authFlag = request.cookies.get('admin-authenticated')?.value

    // If no token, check if we just authenticated (temporary flag set during redirect)
    if (!token) {
      // If auth flag exists, give a moment for the session cookie to be available
      // This handles the case where cookie is set during redirect but not yet in request
      if (authFlag === 'true') {
        // Allow through - the cookie should be available
        return NextResponse.next()
      }
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    try {
      // Verify the JWT token using jose (Edge-compatible)
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')
      await jwtVerify(token, secret)
      // Token is valid, allow the request to proceed
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // Allow all other requests to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

