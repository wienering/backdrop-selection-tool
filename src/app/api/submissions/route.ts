import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const attendantId = searchParams.get('attendantId')
    const backdropId = searchParams.get('backdropId')

    const where: any = {}
    if (attendantId) where.attendantId = attendantId
    if (backdropId) where.backdropId = backdropId

    const submissions = await prisma.submission.findMany({
      where,
      include: {
        backdrop: {
          select: {
            id: true,
            name: true,
            thumbnailUrl: true
          }
        },
        attendant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// POST create new submission
export async function POST(request: NextRequest) {
  try {
    const { clientName, clientEmail, eventDate, backdropId, attendantId } = await request.json()

    if (!clientName || !clientEmail || !eventDate || !backdropId || !attendantId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Verify backdrop exists and is public
    const backdrop = await prisma.backdrop.findUnique({
      where: { id: backdropId }
    })

    if (!backdrop) {
      return NextResponse.json(
        { error: 'Backdrop not found' },
        { status: 404 }
      )
    }

    if (!backdrop.publicStatus) {
      return NextResponse.json(
        { error: 'This backdrop is not available for selection' },
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

    const submission = await prisma.submission.create({
      data: {
        clientName,
        clientEmail,
        eventDate: new Date(eventDate),
        backdropId,
        attendantId
      },
      include: {
        backdrop: {
          select: {
            id: true,
            name: true,
            thumbnailUrl: true
          }
        },
        attendant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}