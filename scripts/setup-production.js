const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('🔌 Connecting to database...')
    await prisma.$connect()
    console.log('✅ Database connected')

    console.log('📋 Setting up database schema...')
    
    // Create tables using raw SQL to avoid migration conflicts
    const createTablesSQL = `
      -- Create admin_users table if not exists
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      -- Create attendants table if not exists
      CREATE TABLE IF NOT EXISTS "attendants" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      -- Create backdrops table if not exists
      CREATE TABLE IF NOT EXISTS "backdrops" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "thumbnailUrl" TEXT NOT NULL,
        "publicStatus" BOOLEAN NOT NULL DEFAULT true,
        "attendantId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL
      );

      -- Create backdrop_images table if not exists
      CREATE TABLE IF NOT EXISTS "backdrop_images" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "backdropId" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      -- Create submissions table if not exists
      CREATE TABLE IF NOT EXISTS "submissions" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "clientName" TEXT NOT NULL,
        "clientEmail" TEXT NOT NULL,
        "eventDate" TIMESTAMP(3) NOT NULL,
        "backdropId" TEXT NOT NULL,
        "attendantId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `

    await prisma.$executeRawUnsafe(createTablesSQL)
    console.log('✅ Database tables created/verified')

    // Create indexes if they don't exist
    const createIndexesSQL = `
      CREATE UNIQUE INDEX IF NOT EXISTS "admin_users_email_key" ON "admin_users"("email");
      CREATE UNIQUE INDEX IF NOT EXISTS "attendants_email_key" ON "attendants"("email");
    `

    await prisma.$executeRawUnsafe(createIndexesSQL)
    console.log('✅ Database indexes created/verified')

    // Add foreign key constraints if they don't exist
    const addConstraintsSQL = `
      DO $$ 
      BEGIN
        -- Add foreign key constraints if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'backdrops_attendantId_fkey') THEN
          ALTER TABLE "backdrops" ADD CONSTRAINT "backdrops_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'backdrop_images_backdropId_fkey') THEN
          ALTER TABLE "backdrop_images" ADD CONSTRAINT "backdrop_images_backdropId_fkey" FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'submissions_backdropId_fkey') THEN
          ALTER TABLE "submissions" ADD CONSTRAINT "submissions_backdropId_fkey" FOREIGN KEY ("backdropId") REFERENCES "backdrops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'submissions_attendantId_fkey') THEN
          ALTER TABLE "submissions" ADD CONSTRAINT "submissions_attendantId_fkey" FOREIGN KEY ("attendantId") REFERENCES "attendants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `

    await prisma.$executeRawUnsafe(addConstraintsSQL)
    console.log('✅ Foreign key constraints added/verified')

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
