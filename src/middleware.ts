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
    console.log('=== MIDDLEWARE CHECK ===')
    console.log('Pathname:', pathname)
    console.log('Request URL:', request.url)
    
    const allCookies = request.cookies.getAll()
    console.log('All cookies received:', allCookies.map(c => ({ name: c.name, value: c.value?.substring(0, 20) + '...' })))
    
    const token = request.cookies.get('admin-session')?.value
    const authFlag = request.cookies.get('admin-authenticated')?.value
    
    console.log('admin-session cookie:', token ? 'PRESENT' : 'MISSING')
    console.log('admin-authenticated cookie:', authFlag ? 'PRESENT' : 'MISSING')

    // If no token, check if we just authenticated (temporary flag set during redirect)
    if (!token) {
      console.log('No session token found')
      // If auth flag exists, give a moment for the session cookie to be available
      // This handles the case where cookie is set during redirect but not yet in request
      if (authFlag === 'true') {
        console.log('Auth flag found, allowing through')
        // Allow through - the cookie should be available
        return NextResponse.next()
      }
      // Redirect to login if no token
      console.log('No token or auth flag, redirecting to login')
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    try {
      // Verify the JWT token using jose (Edge-compatible)
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')
      const { payload } = await jwtVerify(token, secret)
      console.log('Token verified successfully:', payload)
      // Token is valid, allow the request to proceed
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      console.error('=== TOKEN VERIFICATION FAILED ===')
      console.error('Error:', error)
      console.error('Token value:', token?.substring(0, 50))
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

