import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const backdrops = await prisma.backdrop.findMany({
      include: {
        images: true
      }
    })

    // Test if the first image URL is accessible
    let imageTest = null
    if (backdrops.length > 0 && backdrops[0].images.length > 0) {
      const testUrl = backdrops[0].images[0].imageUrl
      try {
        const response = await fetch(testUrl)
        imageTest = {
          url: testUrl,
          status: response.status,
          accessible: response.ok
        }
      } catch (error) {
        imageTest = {
          url: testUrl,
          error: error.message
        }
      }
    }

    return NextResponse.json({
      backdrops: backdrops.map(backdrop => ({
        id: backdrop.id,
        name: backdrop.name,
        thumbnailUrl: backdrop.thumbnailUrl,
        images: backdrop.images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl
        }))
      })),
      imageTest
    })
  } catch (error) {
    console.error('Error fetching backdrops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch backdrops' },
      { status: 500 }
    )
  }
}
