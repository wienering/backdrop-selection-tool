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

    // Set the session cookie and redirect to dashboard
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url))
    
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(new URL('/admin?error=verification-failed', request.url))
  }
}