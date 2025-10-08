import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/admin?error=invalid-token', request.url))
    }

    // For now, we'll just verify the token exists and redirect to dashboard
    // In production, you'd verify the token against your database
    
    // Create a simple JWT session token
    const sessionToken = jwt.sign(
      { email: 'admin@photoboothguys.ca', type: 'admin' },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: '24h' }
    )

    // Set the session cookie and redirect to dashboard
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url))
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.redirect(new URL('/admin?error=verification-failed', request.url))
  }
}
