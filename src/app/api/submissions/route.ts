import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendSubmissionNotification, sendClientConfirmation } from '@/lib/email'
import { normalizeEventDate } from '@/lib/dateUtils'

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
        eventDate: normalizeEventDate(eventDate),
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

    // Send email notifications
    try {
      // Email the attendant about the new selection
      await sendSubmissionNotification(
        attendant.email,
        clientName,
        clientEmail,
        eventDate,
        backdrop.name
      )

      // Email the client with confirmation
      await sendClientConfirmation(
        clientEmail,
        clientName,
        eventDate,
        backdrop.name
      )
    } catch (emailError) {
      console.error('Error sending emails:', emailError)
      // Don't fail the submission if email fails
    }

    // Update agreements app with backdrop selection (non-blocking)
    const agreementsApiUrl = process.env.AGREEMENTS_API_URL
    if (agreementsApiUrl) {
      try {
        const response = await fetch(`${agreementsApiUrl}/api/agreements/update-backdrop-selection`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientEmail,
            clientName,
            eventDate,
            backdropName: backdrop.name,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Agreements API returned error:', response.status, errorData)
        } else {
          const result = await response.json()
          console.log('Successfully updated agreements with backdrop selection:', result.updatedCount, 'agreement(s) updated')
        }
      } catch (apiError) {
        console.error('Error calling agreements API to update backdrop selection:', apiError)
        // Don't fail the submission if agreements API call fails
      }
    }

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}