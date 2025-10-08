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

    // Check table structure and add foreign key constraints carefully
    console.log('🔍 Checking table structure...')
    
    // Check if columns exist before adding constraints
    const checkColumnSQL = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'backdrops' AND column_name = 'attendantId'
    `
    
    const columnCheck = await prisma.$queryRawUnsafe(checkColumnSQL)
    console.log('Backdrops table columns check:', columnCheck)
    
    // Only add foreign key constraints if the columns exist
    try {
      // Check if backdrops table has attendantId column
      const backdropsColumns = await prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'backdrops' AND column_name = 'attendantId'
      `)
      
      if (backdropsColumns.length > 0) {
        await prisma.$executeRawUnsafe(`
          DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'backdrops_attendantId_fkey') THEN
              ALTER TABLE "backdrops" ADD CONSTRAINT "backdrops_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
          END $$;
        `)
        console.log('✅ Backdrops foreign key constraint added')
      } else {
        console.log('⚠️  Backdrops table missing attendantId column, skipping constraint')
      }
    } catch (error) {
      console.log('⚠️  Could not add backdrops foreign key constraint:', error.message)
    }

    try {
      // Check if backdrop_images table has backdropId column
      const backdropImagesColumns = await prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'backdrop_images' AND column_name = 'backdropId'
      `)
      
      if (backdropImagesColumns.length > 0) {
        await prisma.$executeRawUnsafe(`
          DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'backdrop_images_backdropId_fkey') THEN
              ALTER TABLE "backdrop_images" ADD CONSTRAINT "backdrop_images_backdropId_fkey" FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
          END $$;
        `)
        console.log('✅ Backdrop images foreign key constraint added')
      } else {
        console.log('⚠️  Backdrop images table missing backdropId column, skipping constraint')
      }
    } catch (error) {
      console.log('⚠️  Could not add backdrop images foreign key constraint:', error.message)
    }

    try {
      // Check if submissions table has required columns
      const submissionsColumns = await prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'submissions' AND column_name IN ('backdropId', 'attendantId')
      `)
      
      if (submissionsColumns.length >= 2) {
        await prisma.$executeRawUnsafe(`
          DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'submissions_backdropId_fkey') THEN
              ALTER TABLE "submissions" ADD CONSTRAINT "submissions_backdropId_fkey" FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
          END $$;
        `)
        
        await prisma.$executeRawUnsafe(`
          DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'submissions_attendantId_fkey') THEN
              ALTER TABLE "submissions" ADD CONSTRAINT "submissions_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
            END IF;
          END $$;
        `)
        console.log('✅ Submissions foreign key constraints added')
      } else {
        console.log('⚠️  Submissions table missing required columns, skipping constraints')
      }
    } catch (error) {
      console.log('⚠️  Could not add submissions foreign key constraints:', error.message)
    }
    
    console.log('✅ Foreign key constraints processing completed')

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
