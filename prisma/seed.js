require('dotenv').config({ path: '.env' })
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    const email = process.env.ADMIN_EMAIL || 'admin@gandaki-graphics.com'
    const password = process.env.ADMIN_PASSWORD || 'admin123'

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    })

    if (existingAdmin) {
      console.log('✓ Admin account already exists:', email)
      return
    }

    // Create admin account
    const passwordHash = await bcrypt.hash(password, 10)

    const admin = await prisma.admin.create({
      data: {
        email,
        passwordHash,
      },
    })

    console.log('✓ Admin account created:', admin.email)
    console.log('✓ Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
