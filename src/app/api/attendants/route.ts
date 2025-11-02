import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'

// GET all attendants
export async function GET(request: NextRequest) {
  // Require admin authentication
  const authError = requireAdminAuth(request)
  if (authError) return authError
  try {
    // Test database connection first
    await prisma.$connect()
    
    const attendants = await prisma.attendant.findMany({
      include: {
        _count: {
          select: {
            backdrops: true,
            submissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(attendants)
  } catch (error) {
    console.error('Error fetching attendants:', error)
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('connect')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL environment variable.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch attendants', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST create new attendant
export async function POST(request: NextRequest) {
  // Require admin authentication
  const authError = requireAdminAuth(request)
  if (authError) return authError

  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // No need to check for existing email since multiple attendants can use the same email

    const attendant = await prisma.attendant.create({
      data: { name, email }
    })

    return NextResponse.json(attendant, { status: 201 })
  } catch (error) {
    console.error('Error creating attendant:', error)
    return NextResponse.json(
      { error: 'Failed to create attendant' },
      { status: 500 }
    )
  }
}
