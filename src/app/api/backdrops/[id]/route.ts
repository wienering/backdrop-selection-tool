import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single backdrop
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const backdrop = await prisma.backdrop.findUnique({
      where: { id: params.id },
      include: {
        attendant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true,
        submissions: {
          include: {
            attendant: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    if (!backdrop) {
      return NextResponse.json(
        { error: 'Backdrop not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(backdrop)
  } catch (error) {
    console.error('Error fetching backdrop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backdrop' },
      { status: 500 }
    )
  }
}

// PUT update backdrop
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, publicStatus } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const backdrop = await prisma.backdrop.update({
      where: { id: params.id },
      data: {
        name,
        description,
        publicStatus
      },
      include: {
        attendant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        images: true
      }
    })

    return NextResponse.json(backdrop)
  } catch (error) {
    console.error('Error updating backdrop:', error)
    return NextResponse.json(
      { error: 'Failed to update backdrop' },
      { status: 500 }
    )
  }
}

// DELETE backdrop
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.backdrop.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Backdrop deleted successfully' })
  } catch (error) {
    console.error('Error deleting backdrop:', error)
    return NextResponse.json(
      { error: 'Failed to delete backdrop' },
      { status: 500 }
    )
  }
}
