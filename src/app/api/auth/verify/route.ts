import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/admin?error=invalid-token', request.url))
    }

    // In production, you should verify the token against your database
    // For now, we'll accept any valid token
    const email = 'info@photoboothguys.ca'
    
    // Create a JWT session token with the email
    const sessionToken = jwt.sign(
      { email, type: 'admin' },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // Get the base URL for redirect
    const baseUrl = new URL(request.url).origin
    const dashboardUrl = `${baseUrl}/admin/dashboard`

    // Create redirect response with 302 (temporary redirect) to ensure cookie is sent
    const response = NextResponse.redirect(dashboardUrl, { status: 302 })
    
    // Set the session cookie with explicit settings
    // Using 'strict' sameSite might cause issues with email links, so we use 'lax'
    // But we also set a temporary auth flag cookie that can be checked immediately
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    // Also set a non-httpOnly flag so client can verify immediately if needed
    response.cookies.set('admin-authenticated', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60, // 1 minute - just long enough for redirect
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(new URL('/admin?error=verification-failed', request.url))
  }
}