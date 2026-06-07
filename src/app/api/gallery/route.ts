import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

const INITIAL_ITEMS = [
  { category: 'T-shirts', title: 'Graphic Tee — Bold Print', desc: 'Full-color front print', color: '#F1EFE8', accent: '#5F5E5A', image: '/gallery/tshirt1.png', rating: 5, customer: 'Sarah M.', review: 'The colors came out exactly how we wanted.' },
  { category: 'Hoodies', title: 'Pullover Hoodie', desc: 'Chest logo + back design', color: '#E6F1FB', accent: '#185FA5', image: '/gallery/hoodie1.png', rating: 5, customer: 'Aarav K.', review: 'Soft fabric, clean print, and fast delivery.' },
  { category: 'Cups',     title: 'Custom Mug — Wrap Print', desc: '360° wraparound design', color: '#E1F5EE', accent: '#0F6E56', image: '/gallery/cup1.png', rating: 5, customer: 'Mina T.', review: 'A perfect gift. The mug print looks premium.' },
  { category: 'T-shirts', title: 'Event Tee — Team Design', desc: 'Multi-color artwork', color: '#FAEEDA', accent: '#854F0B', image: '/gallery/tshirt2.png', rating: 5, customer: 'Rita P.', review: 'Our event shirts arrived right on time.' },
  { category: 'T-shirts', title: 'Minimalist Pocket Tee', desc: 'Small chest print', color: '#FCEBEB', accent: '#A32D2D', image: '/gallery/tshirt3.png', rating: 5, customer: 'Anil S.', review: 'Small details were sharp and durable.' },
  { category: 'Hoodies', title: 'Zip-up Hoodie', desc: 'Sleeve & back graphics', color: '#FBEAF0', accent: '#993556', image: '/gallery/hoodie2.png', rating: 5, customer: 'Nisha B.', review: 'Great embroidery look without the embroidery price.' },
  { category: 'Cups',    title: 'Gift Mug Set', desc: 'Custom name + pattern', color: '#EAF3DE', accent: '#3B6D11', image: '/gallery/cup2.png', rating: 5, customer: 'Dev P.', review: 'The gift set was a hit with our team.' },
  { category: 'T-shirts', title: 'Kids Tee — Cartoon Art', desc: 'Bright full-front print', color: '#E6F1FB', accent: '#185FA5', image: '/gallery/tshirt4.png', rating: 5, customer: 'Priya S.', review: 'Bright, playful, and really well made.' },
  { category: 'Hoodies', title: 'Oversized Hoodie', desc: 'Large back graphic', color: '#F1EFE8', accent: '#444441', image: '/gallery/hoodie3.png', rating: 5, customer: 'Kiran G.', review: 'The oversized fit looked exactly as expected.' }
]

function sanitizeFilename(filename: string) {
  const baseName = filename.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-')
  return baseName.replace(/^-+|-+$/g, '') || 'gallery-image'
}

export async function GET() {
  try {
    let items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // Auto-seed if empty
    if (items.length === 0) {
      console.log('🌱 Gallery database is empty. Seeding default gallery items...')
      await prisma.galleryItem.createMany({
        data: INITIAL_ITEMS,
      })
      items = await prisma.galleryItem.findMany({
        orderBy: { createdAt: 'desc' },
      })
    }

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('Error fetching gallery:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contentType = request.headers.get('content-type') || ''
    let category = ''
    let title = ''
    let desc = ''
    let color = ''
    let accent = ''
    let rating = 5
    let customer = ''
    let review = ''
    let imagePath = ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      category = String(formData.get('category') || '')
      title = String(formData.get('title') || '')
      desc = String(formData.get('desc') || '')
      color = String(formData.get('color') || '#F1EFE8')
      accent = String(formData.get('accent') || '#444441')
      rating = parseInt(String(formData.get('rating') || '5'), 10)
      customer = String(formData.get('customer') || '')
      review = String(formData.get('review') || '')

      const imageFile = formData.get('imageFile')
      if (imageFile instanceof File && imageFile.size > 0) {
        // Limit size to 10MB
        if (imageFile.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: 'Image size must be 10MB or smaller.' }, { status: 413 })
        }

        const fileBuffer = Buffer.from(await imageFile.arrayBuffer())

        // Try Cloudinary first
        const cloudResult = await uploadToCloudinary(fileBuffer, {
          folder: 'gandaki-graphics/gallery',
          resourceType: 'image',
        })

        if (cloudResult) {
          // Cloudinary upload succeeded — use CDN URL
          imagePath = cloudResult.url
          console.log('☁️  Gallery image uploaded to Cloudinary:', cloudResult.url)
        } else {
          // Fall back to local disk storage
          const galleryUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
          await fs.mkdir(galleryUploadsDir, { recursive: true })

          const safeName = sanitizeFilename(imageFile.name)
          const storedFileName = `${Date.now()}-${safeName}`

          await fs.writeFile(path.join(galleryUploadsDir, storedFileName), fileBuffer)
          imagePath = `/uploads/gallery/${storedFileName}`
          console.log('💾  Gallery image saved locally (Cloudinary not configured):', imagePath)
        }
      } else {
        imagePath = String(formData.get('image') || '/gallery/tshirt1.png')
      }
    } else {
      const body = await request.json()
      category = body.category
      title = body.title
      desc = body.desc
      color = body.color || '#F1EFE8'
      accent = body.accent || '#444441'
      rating = parseInt(body.rating || '5', 10)
      customer = body.customer
      review = body.review
      imagePath = body.image || '/gallery/tshirt1.png'
    }

    if (!category || !title || !desc || !customer || !review) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        category,
        title,
        desc,
        color,
        accent,
        image: imagePath,
        rating,
        customer,
        review,
      },
    })

    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating gallery item:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    )
  }
}
