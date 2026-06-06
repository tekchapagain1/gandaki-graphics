import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

async function seed() {
  try {
    console.log('🌱 Seeding database...')

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: process.env.ADMIN_EMAIL || 'admin@gandaki-graphics.com' },
    })

    if (existingAdmin) {
      console.log('✓ Admin account already exists')
      return
    }

    // Create admin account
    const passwordHash = await hashPassword(
      process.env.ADMIN_PASSWORD || 'admin123'
    )

    const admin = await prisma.admin.create({
      data: {
        email: process.env.ADMIN_EMAIL || 'admin@gandaki-graphics.com',
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
