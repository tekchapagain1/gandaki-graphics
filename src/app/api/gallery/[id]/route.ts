import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  isCloudinaryUrl,
} from '@/lib/cloudinary'

function sanitizeFilename(filename: string) {
  const baseName = filename.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-')
  return baseName.replace(/^-+|-+$/g, '') || 'gallery-image'
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const itemId = parseInt((await params).id, 10)
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // Check if item exists
    const existingItem = await prisma.galleryItem.findUnique({
      where: { id: itemId },
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    const contentType = request.headers.get('content-type') || ''
    let category: string | undefined
    let title: string | undefined
    let desc: string | undefined
    let color: string | undefined
    let accent: string | undefined
    let rating: number | undefined
    let customer: string | undefined
    let review: string | undefined
    let imagePath: string | undefined

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      if (formData.has('category')) category = String(formData.get('category'))
      if (formData.has('title')) title = String(formData.get('title'))
      if (formData.has('desc')) desc = String(formData.get('desc'))
      if (formData.has('color')) color = String(formData.get('color'))
      if (formData.has('accent')) accent = String(formData.get('accent'))
      if (formData.has('rating')) rating = parseInt(String(formData.get('rating')), 10)
      if (formData.has('customer')) customer = String(formData.get('customer'))
      if (formData.has('review')) review = String(formData.get('review'))

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
          imagePath = cloudResult.url
          console.log('☁️  Updated gallery image uploaded to Cloudinary:', cloudResult.url)

          // Delete old Cloudinary asset if the previous image was also on Cloudinary
          if (isCloudinaryUrl(existingItem.image)) {
            const oldPublicId = extractPublicId(existingItem.image)
            if (oldPublicId) {
              await deleteFromCloudinary(oldPublicId)
              console.log('🗑️  Old Cloudinary asset deleted:', oldPublicId)
            }
          }
        } else {
          // Fall back to local disk storage
          const galleryUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'gallery')
          await fs.mkdir(galleryUploadsDir, { recursive: true })

          const safeName = sanitizeFilename(imageFile.name)
          const storedFileName = `${Date.now()}-${safeName}`

          await fs.writeFile(path.join(galleryUploadsDir, storedFileName), fileBuffer)
          imagePath = `/uploads/gallery/${storedFileName}`
          console.log('💾  Updated gallery image saved locally:', imagePath)

          // Clean up old local file
          if (existingItem.image.startsWith('/uploads/gallery/')) {
            try {
              const oldFilePath = path.join(process.cwd(), 'public', existingItem.image)
              await fs.unlink(oldFilePath)
            } catch (err) {
              console.warn(`Could not delete old file ${existingItem.image}:`, err)
            }
          }
        }
      } else if (formData.has('image')) {
        imagePath = String(formData.get('image'))
      }
    } else {
      const body = await request.json()
      category = body.category
      title = body.title
      desc = body.desc
      color = body.color
      accent = body.accent
      if (body.rating !== undefined) rating = parseInt(body.rating, 10)
      customer = body.customer
      review = body.review
      imagePath = body.image
    }

    const updateData: Record<string, unknown> = {}
    if (category !== undefined) updateData.category = category
    if (title !== undefined) updateData.title = title
    if (desc !== undefined) updateData.desc = desc
    if (color !== undefined) updateData.color = color
    if (accent !== undefined) updateData.accent = accent
    if (rating !== undefined && !isNaN(rating)) updateData.rating = rating
    if (customer !== undefined) updateData.customer = customer
    if (review !== undefined) updateData.review = review
    if (imagePath !== undefined) updateData.image = imagePath

    const updatedItem = await prisma.galleryItem.update({
      where: { id: itemId },
      data: updateData,
    })

    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error) {
    console.error('Error updating gallery item:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const itemId = parseInt((await params).id, 10)
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    // Check if item exists
    const existingItem = await prisma.galleryItem.findUnique({
      where: { id: itemId },
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    // Delete item from database
    await prisma.galleryItem.delete({
      where: { id: itemId },
    })

    // Clean up the stored image
    if (isCloudinaryUrl(existingItem.image)) {
      // Delete from Cloudinary
      const publicId = extractPublicId(existingItem.image)
      if (publicId) {
        await deleteFromCloudinary(publicId)
        console.log('🗑️  Cloudinary asset deleted:', publicId)
      }
    } else if (existingItem.image.startsWith('/uploads/gallery/')) {
      // Delete from local disk
      try {
        const filePath = path.join(process.cwd(), 'public', existingItem.image)
        await fs.unlink(filePath)
      } catch (err) {
        console.warn(`Could not delete file ${existingItem.image}:`, err)
      }
    }

    return NextResponse.json({ success: true, message: 'Gallery item deleted' })
  } catch (error) {
    console.error('Error deleting gallery item:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    )
  }
}
