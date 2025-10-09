const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Adding order fields to existing records...')
  
  try {
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Update existing backdrops with order based on creation date
    const backdrops = await prisma.backdrop.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    console.log(`Found ${backdrops.length} backdrops to update`)
    
    for (let i = 0; i < backdrops.length; i++) {
      await prisma.backdrop.update({
        where: { id: backdrops[i].id },
        data: { order: i }
      })
    }
    
    console.log('✅ Updated backdrop order fields')
    
    // Update existing backdrop images with order based on creation date
    const backdropImages = await prisma.backdropImage.findMany({
      orderBy: { createdAt: 'asc' }
    })
    
    console.log(`Found ${backdropImages.length} backdrop images to update`)
    
    // Group images by backdrop
    const imagesByBackdrop = {}
    for (const image of backdropImages) {
      if (!imagesByBackdrop[image.backdropId]) {
        imagesByBackdrop[image.backdropId] = []
      }
      imagesByBackdrop[image.backdropId].push(image)
    }
    
    // Update order for each backdrop's images
    for (const backdropId in imagesByBackdrop) {
      const images = imagesByBackdrop[backdropId]
      for (let i = 0; i < images.length; i++) {
        await prisma.backdropImage.update({
          where: { id: images[i].id },
          data: { order: i }
        })
      }
    }
    
    console.log('✅ Updated backdrop image order fields')
    console.log('✅ Migration complete')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
