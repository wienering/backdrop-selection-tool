import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Test cookie endpoint called')
    
    // Set a simple test cookie
    const response = NextResponse.json({ 
      message: 'Test cookie set',
      timestamp: new Date().toISOString()
    })
    
    response.cookies.set('test-cookie', 'test-value-123', {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600, // 1 hour
      path: '/'
    })
    
    console.log('Test cookie set successfully')
    return response
  } catch (error) {
    console.error('Test cookie error:', error)
    return NextResponse.json({ error: 'Failed to set test cookie' }, { status: 500 })
  }
}