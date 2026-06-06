import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { randomBytes } from 'crypto'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmation } from '@/lib/email'
import {
  createRateLimiter,
  getClientIP,
  type OrderSubmission,
  validateOrderSubmission,
  detectSuspiciousOrder,
  logSuspiciousActivity,
  isIPFlagged,
} from '@/lib/security'

// Rate limiter: 10 orders per IP per 24 hours
const orderRateLimiter = createRateLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  maxRequests: 10,
})

const MAX_DESIGN_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_DESIGN_FILE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
  'image/webp',
  'application/postscript',
  'application/illustrator',
  'application/vnd.adobe.photoshop',
  'application/octet-stream',
])

function sanitizeFilename(filename: string) {
  const baseName = filename.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-')
  return baseName.replace(/^-+|-+$/g, '') || 'design-file'
}

function generateOrderCode() {
  return `GG-${randomBytes(3).toString('hex').toUpperCase()}`
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const contentType = request.headers.get('content-type') || ''

    let body: OrderSubmission = {
      name: '',
      email: '',
      phone: '',
      product: '',
      quantity: '',
      size: '',
      color: '',
      designNotes: '',
      deadline: '',
    }
    let uploadedDesignFile: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const getField = (key: string) => {
        const value = formData.get(key)
        return typeof value === 'string' ? value : ''
      }

      body = {
        name: getField('name'),
        email: getField('email'),
        phone: getField('phone'),
        product: getField('product'),
        size: getField('size'),
        color: getField('color'),
        quantity: getField('quantity'),
        designNotes: getField('designNotes'),
        deadline: getField('deadline'),
      }

      const fileEntry = formData.get('designFile')
      if (fileEntry instanceof File && fileEntry.size > 0) {
        uploadedDesignFile = fileEntry
      }
    } else {
      body = (await request.json()) as OrderSubmission
    }

    // 1. Check rate limit
    const rateLimitResult = orderRateLimiter(request)
    if (!rateLimitResult.allowed) {
      logSuspiciousActivity({
        type: 'rate_limit',
        ip: clientIP,
        email: body.email,
        reason: `Rate limit exceeded: ${rateLimitResult.retryAfter}s remaining`,
      })

      return NextResponse.json(
        {
          error: 'Too many orders from this IP. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      )
    }

    // 2. Check if IP is flagged
    if (isIPFlagged(clientIP)) {
      logSuspiciousActivity({
        type: 'rate_limit',
        ip: clientIP,
        email: body.email,
        reason: 'Flagged IP attempting multiple orders',
      })

      return NextResponse.json(
        { error: 'This IP has been flagged for suspicious activity. Contact support.' },
        { status: 403 }
      )
    }

    // 3. Validate input data
    const validation = validateOrderSubmission(body)
    if (!validation.valid) {
      logSuspiciousActivity({
        type: 'validation_fail',
        ip: clientIP,
        email: body.email,
        reason: `Validation failed: ${validation.errors.join(', ')}`,
      })

      return NextResponse.json(
        { error: 'Invalid order data', details: validation.errors },
        { status: 400 }
      )
    }

    // 4. Detect suspicious patterns
    const warnings = detectSuspiciousOrder(body)
    if (warnings.length > 0) {
      logSuspiciousActivity({
        type: 'suspicious_pattern',
        ip: clientIP,
        email: body.email,
        reason: `Suspicious patterns detected: ${warnings.join(', ')}`,
        data: {
          name: body.name,
          product: body.product,
          quantity: body.quantity,
        },
      })

      // Flag but still allow (admin can review)
      console.warn(`⚠️  Suspicious order detected from ${clientIP}:`, warnings)
    }

    let designFileName: string | null = null
    let designFilePath: string | null = null
    let orderCode: string | null = null

    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateOrderCode()
      const existing = await prisma.order.findUnique({
        where: { orderCode: candidate },
        select: { id: true },
      })

      if (!existing) {
        orderCode = candidate
        break
      }
    }

    if (!orderCode) {
      return NextResponse.json(
        { error: 'Failed to generate order code. Please try again.' },
        { status: 500 }
      )
    }

    if (uploadedDesignFile) {
      if (uploadedDesignFile.size > MAX_DESIGN_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Design file must be 50MB or smaller.' },
          { status: 413 }
        )
      }

      if (!ALLOWED_DESIGN_FILE_TYPES.has(uploadedDesignFile.type)) {
        return NextResponse.json(
          { error: 'Unsupported design file type. Please upload PNG, JPG, PDF, AI, PSD, or WebP files.' },
          { status: 400 }
        )
      }

      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'designs')
      await fs.mkdir(uploadsDir, { recursive: true })

      const safeName = sanitizeFilename(uploadedDesignFile.name)
      const storedFileName = `${Date.now()}-${safeName}`
      const fileBuffer = Buffer.from(await uploadedDesignFile.arrayBuffer())

      await fs.writeFile(path.join(uploadsDir, storedFileName), fileBuffer)

      designFileName = uploadedDesignFile.name
      designFilePath = `/uploads/designs/${storedFileName}`
    }

    // 5. Create order
    const order = await prisma.order.create({
      data: {
        orderCode,
        name: body.name,
        email: body.email,
        phone: body.phone,
        product: body.product,
        size: body.size || null,
        color: body.color || null,
        quantity: parseInt(body.quantity, 10),
        designNotes: body.designNotes || null,
        designFileName,
        designFilePath,
        deadline: body.deadline || null,
        status: 'pending',
      },
    })

    // 6. Send confirmation emails
    await sendOrderConfirmation({
      customerName: body.name,
      customerEmail: body.email,
      customerPhone: body.phone,
      orderId: orderCode,
      product: body.product,
      quantity: body.quantity,
      details: body.designNotes || `Size: ${body.size || 'N/A'}, Color: ${body.color || 'N/A'}`,
      estimatedTurnaround: '2-3 business days',
      designFileName: designFileName || undefined,
      designFileUrl: designFilePath || undefined,
    })

    console.log(`✅ Order ${orderCode} (#${order.id}) created successfully from ${clientIP}`)

    return NextResponse.json(
      { success: true, orderId: order.id, orderCode },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error creating order:', error)

    // Log database/server errors
    const clientIP = getClientIP(request)
    logSuspiciousActivity({
      type: 'validation_fail',
      ip: clientIP,
      reason: 'Server error during order creation',
    })

    return NextResponse.json(
      { error: 'Failed to create order. Please try again or contact support.' },
      { status: 500 }
    )
  }
}
