import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all backdrops
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const attendantId = searchParams.get('attendantId')

    const where = attendantId ? { attendantId } : {}

    const backdrops = await prisma.backdrop.findMany({
      where: attendantId ? {
        attendants: {
          some: {
            attendantId: attendantId
          }
        }
      } : {},
      include: {
        attendants: {
          include: {
            attendant: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            submissions: true
          }
        }
      },
      orderBy: {
        order: 'asc'
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
    const { name, description, thumbnailUrl, attendantIds, publicStatus = true } = await request.json()

    if (!name || !attendantIds || attendantIds.length === 0) {
      return NextResponse.json(
        { error: 'Name and at least one attendant ID are required' },
        { status: 400 }
      )
    }

    // Verify all attendants exist
    const attendants = await prisma.attendant.findMany({
      where: { id: { in: attendantIds } }
    })

    if (attendants.length !== attendantIds.length) {
      return NextResponse.json(
        { error: 'One or more attendants not found' },
        { status: 404 }
      )
    }

    // Get the current count of backdrops to set the order
    const backdropCount = await prisma.backdrop.count()

    const backdrop = await prisma.backdrop.create({
      data: {
        name,
        description,
        thumbnailUrl: thumbnailUrl || '',
        publicStatus,
        order: backdropCount,
        attendants: {
          create: attendantIds.map((attendantId: string) => ({
            attendantId
          }))
        }
      },
      include: {
        attendants: {
          include: {
            attendant: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
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
