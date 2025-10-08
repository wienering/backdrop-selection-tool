const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Create a test attendant if none exist
    const attendantCount = await prisma.attendant.count()
    if (attendantCount === 0) {
      console.log('Creating sample data...')
      
      const attendant = await prisma.attendant.create({
        data: {
          name: 'Sample Attendant',
          email: 'attendant@example.com'
        }
      })
      
      console.log('✅ Sample attendant created:', attendant.id)
    } else {
      console.log(`✅ Found ${attendantCount} existing attendants`)
    }
    
    console.log('✅ Database setup complete')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
