import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/auth'

// PUT reorder backdrops
export async function PUT(request: NextRequest) {
  // Require admin authentication
  const authError = requireAdminAuth(request)
  if (authError) return authError

  try {
    const { backdropIds } = await request.json()

    if (!backdropIds || !Array.isArray(backdropIds)) {
      return NextResponse.json(
        { error: 'backdropIds array is required' },
        { status: 400 }
      )
    }

    // Update the order for each backdrop
    const updatePromises = backdropIds.map((backdropId: string, index: number) =>
      prisma.backdrop.update({
        where: { id: backdropId },
        data: { order: index }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({ message: 'Backdrops reordered successfully' })
  } catch (error) {
    console.error('Error reordering backdrops:', error)
    return NextResponse.json(
      { error: 'Failed to reorder backdrops' },
      { status: 500 }
    )
  }
}
