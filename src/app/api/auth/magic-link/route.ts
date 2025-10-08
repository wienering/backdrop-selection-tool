import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLink } from '@/lib/email'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if admin user exists
    const adminUser = await prisma.adminUser.findUnique({
      where: { email }
    })

    if (!adminUser) {
      // Create admin user if they don't exist
      await prisma.adminUser.create({
        data: { email }
      })
    }

    // Generate magic link token
    const token = crypto.randomBytes(32).toString('hex')
    
    // Store token in database (you might want to add a tokens table for production)
    // For now, we'll just send the email
    
    // Send magic link email
    await sendMagicLink(email, token)

    return NextResponse.json({ message: 'Magic link sent successfully' })
  } catch (error) {
    console.error('Magic link error:', error)
    return NextResponse.json(
      { error: 'Failed to send magic link' },
      { status: 500 }
    )
  }
}
