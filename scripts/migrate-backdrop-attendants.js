const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateBackdropAttendants() {
  try {
    console.log('Starting backdrop-attendant migration...')
    
    // First, check if the old attendantId column still exists
    try {
      const backdrops = await prisma.$queryRaw`
        SELECT id, "attendantId" FROM backdrops WHERE "attendantId" IS NOT NULL
      `
      
      console.log(`Found ${backdrops.length} backdrops to migrate`)
      
      // Create BackdropAttendant records for each existing backdrop
      for (const backdrop of backdrops) {
        if (backdrop.attendantId) {
          try {
            await prisma.backdropAttendant.create({
              data: {
                backdropId: backdrop.id,
                attendantId: backdrop.attendantId
              }
            })
            console.log(`Created relationship for backdrop ${backdrop.id} -> attendant ${backdrop.attendantId}`)
          } catch (error) {
            // Ignore duplicate key errors (relationship might already exist)
            if (!error.message.includes('Unique constraint')) {
              console.error(`Error creating relationship for backdrop ${backdrop.id}:`, error.message)
            }
          }
        }
      }
      
      console.log('Migration completed successfully!')
    } catch (error) {
      if (error.message.includes('column "attendantId" does not exist')) {
        console.log('attendantId column already removed, skipping migration')
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
