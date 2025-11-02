import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'

// PUT reorder backdrop images
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require admin authentication
  const authError = requireAdminAuth(request)
  if (authError) return authError

  try {
    const { id } = await params
    const { imageIds } = await request.json()

    if (!imageIds || !Array.isArray(imageIds)) {
      return NextResponse.json(
        { error: 'imageIds array is required' },
        { status: 400 }
      )
    }

    // Verify backdrop exists
    const backdrop = await prisma.backdrop.findUnique({
      where: { id }
    })

    if (!backdrop) {
      return NextResponse.json(
        { error: 'Backdrop not found' },
        { status: 404 }
      )
    }

    // Update the order for each image
    const updatePromises = imageIds.map((imageId: string, index: number) =>
      prisma.backdropImage.update({
        where: { id: imageId },
        data: { order: index }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ message: 'Images reordered successfully' })
  } catch (error) {
    console.error('Error reordering backdrop images:', error)
    return NextResponse.json(
      { error: 'Failed to reorder images' },
      { status: 500 }
    )
  }
}
