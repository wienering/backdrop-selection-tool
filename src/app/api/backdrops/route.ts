import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all backdrops
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const attendantId = searchParams.get('attendantId')

    const where = attendantId ? { attendantId } : {}

    const backdrops = await prisma.backdrop.findMany({
      where,
      include: {
        attendant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true,
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(backdrops)
  } catch (error) {
    console.error('Error fetching backdrops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backdrops' },
      { status: 500 }
    )
  }
}

// POST create new backdrop
export async function POST(request: NextRequest) {
  try {
    const { name, description, thumbnailUrl, attendantId, publicStatus = true } = await request.json()

    if (!name || !attendantId) {
      return NextResponse.json(
        { error: 'Name and attendant ID are required' },
        { status: 400 }
      )
    }

    // Verify attendant exists
    const attendant = await prisma.attendant.findUnique({
      where: { id: attendantId }
    })

    if (!attendant) {
      return NextResponse.json(
        { error: 'Attendant not found' },
        { status: 404 }
      )
    }

    const backdrop = await prisma.backdrop.create({
      data: {
        name,
        description,
        thumbnailUrl: thumbnailUrl || '',
        attendantId,
        publicStatus
      },
      include: {
        attendant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(backdrop, { status: 201 })
  } catch (error) {
    console.error('Error creating backdrop:', error)
    return NextResponse.json(
      { error: 'Failed to create backdrop' },
      { status: 500 }
    )
  }
}
