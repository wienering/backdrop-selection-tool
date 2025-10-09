const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateBackdropAttendants() {
  try {
    console.log('Starting backdrop-attendant migration...')
    
    // First, create the backdrop_attendants table if it doesn't exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "backdrop_attendants" (
          "id" TEXT NOT NULL,
          "backdropId" TEXT NOT NULL,
          "attendantId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "backdrop_attendants_pkey" PRIMARY KEY ("id")
        )
      `
      console.log('Created backdrop_attendants table')
    } catch (error) {
      console.log('backdrop_attendants table might already exist:', error.message)
    }
    
    // Add unique constraint if it doesn't exist
    try {
      await prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "backdrop_attendants_backdropId_attendantId_key" 
        ON "backdrop_attendants"("backdropId", "attendantId")
      `
      console.log('Added unique constraint')
    } catch (error) {
      console.log('Unique constraint might already exist:', error.message)
    }
    
    // Migrate existing data from backdrops.attendantId to backdrop_attendants
    try {
      const backdrops = await prisma.$queryRaw`
        SELECT id, "attendantId" FROM backdrops WHERE "attendantId" IS NOT NULL
      `
      
      console.log(`Found ${backdrops.length} backdrops to migrate`)
      
      for (const backdrop of backdrops) {
        if (backdrop.attendantId) {
          try {
            await prisma.$executeRaw`
              INSERT INTO "backdrop_attendants" ("id", "backdropId", "attendantId", "createdAt")
              VALUES (gen_random_uuid(), $1, $2, NOW())
              ON CONFLICT ("backdropId", "attendantId") DO NOTHING
            `, backdrop.id, backdrop.attendantId
            console.log(`Migrated backdrop ${backdrop.id} -> attendant ${backdrop.attendantId}`)
          } catch (error) {
            console.error(`Error migrating backdrop ${backdrop.id}:`, error.message)
          }
        }
      }
      
      console.log('Data migration completed successfully!')
    } catch (error) {
      if (error.message.includes('column "attendantId" does not exist')) {
        console.log('attendantId column already removed, data migration not needed')
      } else {
        throw error
      }
    }
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateBackdropAttendants()
