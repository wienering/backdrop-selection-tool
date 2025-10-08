const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to database...')
    await prisma.$connect()
    console.log('✅ Database connected')

    console.log('📋 Setting up database schema...')
    
    // Create tables one by one to avoid prepared statement issues
    const tables = [
      {
        name: 'admin_users',
        sql: `CREATE TABLE IF NOT EXISTS "admin_users" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "email" TEXT NOT NULL UNIQUE,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        )`
      },
      {
        name: 'attendants',
        sql: `CREATE TABLE IF NOT EXISTS "attendants" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "email" TEXT NOT NULL UNIQUE,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        )`
      },
      {
        name: 'backdrops',
        sql: `CREATE TABLE IF NOT EXISTS "backdrops" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "thumbnailUrl" TEXT NOT NULL,
          "publicStatus" BOOLEAN NOT NULL DEFAULT true,
          "attendantId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL
        )`
      },
      {
        name: 'backdrop_images',
        sql: `CREATE TABLE IF NOT EXISTS "backdrop_images" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "backdropId" TEXT NOT NULL,
          "imageUrl" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'submissions',
        sql: `CREATE TABLE IF NOT EXISTS "submissions" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "clientName" TEXT NOT NULL,
          "clientEmail" TEXT NOT NULL,
          "eventDate" TIMESTAMP(3) NOT NULL,
          "backdropId" TEXT NOT NULL,
          "attendantId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`
      }
    ]

    for (const table of tables) {
      await prisma.$executeRawUnsafe(table.sql)
      console.log(`✅ Table ${table.name} created/verified`)
    }

    // Create indexes one by one
    const indexes = [
      'CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_key" ON "admin_users"("email")',
      'CREATE UNIQUE INDEX IF NOT EXISTS "attendants_email_key" ON "attendants"("email")'
    ]

    for (const indexSQL of indexes) {
      await prisma.$executeRawUnsafe(indexSQL)
    }
    console.log('✅ Database indexes created/verified')

    // Skip foreign key constraints for now - they can be added later
    // The tables will work fine without them for basic functionality
    console.log('ℹ️  Skipping foreign key constraints for now - tables will work without them')
    console.log('✅ Database setup completed - tables are ready for use')

    // Test the setup by creating a sample attendant
    const attendantCount = await prisma.attendant.count()
    if (attendantCount === 0) {
      const sampleAttendant = await prisma.attendant.create({
        data: {
          name: 'Sample Attendant',
          email: 'attendant@example.com'
        }
      })
      console.log('✅ Sample attendant created:', sampleAttendant.id)
    } else {
      console.log(`✅ Found ${attendantCount} existing attendants`)
    }

    console.log('🎉 Database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
