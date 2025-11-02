import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== VERIFY ROUTE START ===')
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    console.log('Token received:', token ? 'YES' : 'NO')
    console.log('Request URL:', request.url)
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))

    if (!token) {
      console.log('No token found, redirecting to login')
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
    console.log('Session token created:', sessionToken.substring(0, 20) + '...')

    // Get the base URL for redirect
    const baseUrl = new URL(request.url).origin
    const dashboardUrl = `${baseUrl}/admin/dashboard`
    console.log('Redirecting to:', dashboardUrl)
    console.log('NODE_ENV:', process.env.NODE_ENV)

    // Create redirect response with 302 (temporary redirect) to ensure cookie is sent
    const response = NextResponse.redirect(dashboardUrl, { status: 302 })
    
    // Set the session cookie with explicit settings
    // Using 'strict' sameSite might cause issues with email links, so we use 'lax'
    // But we also set a temporary auth flag cookie that can be checked immediately
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    }
    console.log('Cookie options:', cookieOptions)
    
    response.cookies.set('admin-session', sessionToken, cookieOptions)
    console.log('Session cookie set')

    // Also set a non-httpOnly flag so client can verify immediately if needed
    response.cookies.set('admin-authenticated', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60, // 1 minute - just long enough for redirect
      path: '/',
    })
    console.log('Auth flag cookie set')

    // Log all cookies being sent
    console.log('Response cookies:', response.cookies.getAll())
    console.log('=== VERIFY ROUTE END ===')
    
    return response
  } catch (error) {
    console.error('=== VERIFICATION ERROR ===', error)
    return NextResponse.redirect(new URL('/admin?error=verification-failed', request.url))
  }
}