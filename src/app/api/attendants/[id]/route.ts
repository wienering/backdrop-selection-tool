import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single attendant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attendant = await prisma.attendant.findUnique({
      where: { id: params.id },
      include: {
        backdrops: {
          include: {
            _count: {
              select: {
                images: true,
                submissions: true
              }
            }
          }
        },
        submissions: {
          include: {
            backdrop: true
          }
        }
      }
    })

    if (!attendant) {
      return NextResponse.json(
        { error: 'Attendant not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(attendant)
  } catch (error) {
    console.error('Error fetching attendant:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendant' },
      { status: 500 }
    )
  }
}

// PUT update attendant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email already exists for another attendant
    const existingAttendant = await prisma.attendant.findFirst({
      where: {
        email,
        id: { not: params.id }
      }
    })

    if (existingAttendant) {
      return NextResponse.json(
        { error: 'An attendant with this email already exists' },
        { status: 400 }
      )
    }

    const attendant = await prisma.attendant.update({
      where: { id: params.id },
      data: { name, email }
    })

    return NextResponse.json(attendant)
  } catch (error) {
    console.error('Error updating attendant:', error)
    return NextResponse.json(
      { error: 'Failed to update attendant' },
      { status: 500 }
    )
  }
}

// DELETE attendant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.attendant.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Attendant deleted successfully' })
  } catch (error) {
    console.error('Error deleting attendant:', error)
    return NextResponse.json(
      { error: 'Failed to delete attendant' },
      { status: 500 }
    )
  }
}
