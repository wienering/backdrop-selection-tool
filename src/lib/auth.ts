import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

/**
 * Verify admin session from request cookies
 * Returns the decoded token if valid, null otherwise
 */
export function verifyAdminSession(request: NextRequest): { email: string; type: string } | null {
  try {
    const token = request.cookies.get('admin-session')?.value

    if (!token) {
      return null
    }

    // Verify the JWT token
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    ) as { email: string; type: string }

    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Middleware function to check admin authentication for API routes
 * Returns null if authenticated, or a NextResponse with error if not
 */
export function requireAdminAuth(request: NextRequest): NextResponse | null {
  const session = verifyAdminSession(request)

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in to access this resource.' },
      { status: 401 }
    )
  }

  return null
}

