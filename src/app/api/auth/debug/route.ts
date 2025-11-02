import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const allCookies = request.cookies.getAll()
  const sessionCookie = request.cookies.get('admin-session')?.value
  const authFlag = request.cookies.get('admin-authenticated')?.value

  let tokenValid = false
  let tokenDecoded = null
  let tokenError = null

  if (sessionCookie) {
    try {
      tokenDecoded = jwt.verify(sessionCookie, process.env.NEXTAUTH_SECRET || 'fallback-secret')
      tokenValid = true
    } catch (error) {
      tokenError = error instanceof Error ? error.message : 'Unknown error'
    }
  }

  return NextResponse.json({
    cookies: {
      all: allCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
      adminSession: sessionCookie ? 'PRESENT' : 'MISSING',
      adminAuthenticated: authFlag || 'MISSING',
    },
    token: {
      present: !!sessionCookie,
      valid: tokenValid,
      decoded: tokenDecoded,
      error: tokenError,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
    },
    request: {
      url: request.url,
      headers: {
        host: request.headers.get('host'),
        referer: request.headers.get('referer'),
        'user-agent': request.headers.get('user-agent')?.substring(0, 50),
      },
    },
  })
}

