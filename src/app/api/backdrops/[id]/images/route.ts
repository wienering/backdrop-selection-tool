import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST add image to backdrop
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    // Verify backdrop exists
    const backdrop = await prisma.backdrop.findUnique({
      where: { id: params.id }
    })

    if (!backdrop) {
      return NextResponse.json(
        { error: 'Backdrop not found' },
        { status: 404 }
      )
    }

    const backdropImage = await prisma.backdropImage.create({
      data: {
        backdropId: params.id,
        imageUrl
      }
    })

    return NextResponse.json(backdropImage, { status: 201 })
  } catch (error) {
    console.error('Error adding backdrop image:', error)
    return NextResponse.json(
      { error: 'Failed to add backdrop image' },
      { status: 500 }
    )
  }
}

// DELETE image from backdrop
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    await prisma.backdropImage.delete({
      where: { id: imageId }
    })

    return NextResponse.json({ message: 'Image deleted successfully' })
  } catch (error) {
    console.error('Error deleting backdrop image:', error)
    return NextResponse.json(
      { error: 'Failed to delete backdrop image' },
      { status: 500 }
    )
  }
}
