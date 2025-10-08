import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Starting database setup...')
    
    // Test connection first
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Create tables by running a simple query that will trigger table creation
    // This is a workaround since we can't run prisma db push from the API
    
    // First, let's try to create the tables manually using raw SQL
    const createTablesSQL = `
      -- Create admin_users table
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      -- Create attendants table
      CREATE TABLE IF NOT EXISTS "attendants" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      -- Create backdrops table
      CREATE TABLE IF NOT EXISTS "backdrops" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "thumbnailUrl" TEXT NOT NULL,
        "publicStatus" BOOLEAN NOT NULL DEFAULT true,
        "attendantId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE
      );

      -- Create backdrop_images table
      CREATE TABLE IF NOT EXISTS "backdrop_images" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "backdropId" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE
      );

      -- Create submissions table
      CREATE TABLE IF NOT EXISTS "submissions" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "clientName" TEXT NOT NULL,
        "clientEmail" TEXT NOT NULL,
        "eventDate" TIMESTAMP(3) NOT NULL,
        "backdropId" TEXT NOT NULL,
        "attendantId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE,
        FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE
      );
    `

    await prisma.$executeRawUnsafe(createTablesSQL)
    console.log('✅ Database tables created')
    
    // Test the tables by creating a sample attendant
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
      message: 'Database setup completed successfully',
      tablesCreated: true,
      sampleDataCreated: attendantCount === 0
    })
    
  } catch (error) {
    console.error('Database setup failed:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Database setup failed'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
