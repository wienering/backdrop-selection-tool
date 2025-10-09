const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function removeEmailConstraint() {
  try {
    console.log('Removing unique constraint from attendant email...')
    
    // Remove the unique constraint from the email column
    await prisma.$executeRaw`
      DROP INDEX IF EXISTS "attendants_email_key"
    `
    
    console.log('Email unique constraint removed successfully!')
  } catch (error) {
    console.error('Error removing email constraint:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

removeEmailConstraint()
