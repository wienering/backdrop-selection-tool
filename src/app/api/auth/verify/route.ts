import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  console.log('=== VERIFY ENDPOINT CALLED ===')
  console.log('Request URL:', request.url)
  
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    console.log('Token received:', token)

    if (!token) {
      console.log('No token provided - redirecting to admin with error')
      return NextResponse.redirect(new URL('/admin?error=invalid-token', request.url))
    }

    // Get the email from the magic link request
    const email = 'info@photoboothguys.ca'
    console.log('Using email:', email)
    console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET)
    
    // Create a JWT session token with the email
    const sessionToken = jwt.sign(
      { email, type: 'admin' },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )
    console.log('JWT token created successfully')

    // Set the session cookie and redirect to dashboard
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    console.log('Redirecting to:', dashboardUrl.toString())
    
    const response = NextResponse.redirect(dashboardUrl)
    
    // Set cookie
    console.log('Setting admin-session cookie...')
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/'
    })
    console.log('Cookie set successfully')

    return response
  } catch (error) {
    console.error('=== VERIFY ENDPOINT ERROR ===')
    console.error('Error:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack')
    return NextResponse.redirect(new URL('/admin?error=verification-failed', request.url))
  }
}