import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Setting up database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Create a sample attendant to test the connection
    const attendantCount = await prisma.attendant.count()
    
    if (attendantCount === 0) {
      const sampleAttendant = await prisma.attendant.create({
        data: {
          name: 'Sample Attendant',
          email: 'attendant@example.com'
        }
      })
      console.log('✅ Sample attendant created:', sampleAttendant.id)
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database is ready!',
      attendantCount: attendantCount + (attendantCount === 0 ? 1 : 0)
    })
    
  } catch (error) {
    console.error('Database setup failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
