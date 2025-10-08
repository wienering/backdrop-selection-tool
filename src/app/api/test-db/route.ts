import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database structure...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Check what tables exist
    const tables = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `)
    console.log('📋 Tables:', tables)
    
    // Check backdrops table structure specifically
    const backdropsColumns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'backdrops'
      ORDER BY ordinal_position
    `)
    console.log('📊 Backdrops columns:', backdropsColumns)
    
    // Try to create a test attendant
    const testAttendant = await prisma.attendant.create({
      data: {
        name: 'Test Attendant',
        email: 'test@example.com'
      }
    })
    console.log('✅ Test attendant created:', testAttendant.id)
    
    // Try to fetch attendants with relations
    const attendants = await prisma.attendant.findMany({
      include: {
        _count: {
          select: {
            backdrops: true,
            submissions: true
          }
        }
      }
    })
    console.log('✅ Attendants fetched:', attendants.length)
    
    return NextResponse.json({
      success: true,
      tables: tables,
      backdropsColumns: backdropsColumns,
      testAttendant: testAttendant.id,
      attendantsCount: attendants.length
    })
    
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Database test failed'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
