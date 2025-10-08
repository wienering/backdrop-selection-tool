import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const backdrops = await prisma.backdrop.findMany({
      include: {
        images: true
      }
    })

    return NextResponse.json({
      backdrops: backdrops.map(backdrop => ({
        id: backdrop.id,
        name: backdrop.name,
        thumbnailUrl: backdrop.thumbnailUrl,
        images: backdrop.images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl
        }))
      }))
    })
  } catch (error) {
    console.error('Error fetching backdrops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backdrops' },
      { status: 500 }
    )
  }
}
