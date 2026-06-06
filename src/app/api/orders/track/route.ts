import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createRateLimiter, getClientIP, isValidEmail, isValidPhone } from '@/lib/security'

export const dynamic = 'force-dynamic'

const trackingRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 30,
})

type TrackingLookup = {
  orderRef?: string
  emailOrPhone?: string
}

function normalizePhone(value: string) {
  return value.replace(/[-.\s()]/g, '')
}

function buildStatusTimeline(status: string, createdAt: string, updatedAt: string) {
  const base = [
    { label: 'Order received', completed: true, time: createdAt },
    { label: 'Design review', completed: ['confirmed', 'completed'].includes(status), time: updatedAt },
    { label: 'In production', completed: status === 'completed', time: updatedAt },
    { label: 'Ready for pickup', completed: status === 'completed', time: updatedAt },
  ]

  return base
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const rateLimit = trackingRateLimiter(request)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many tracking requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = (await request.json()) as TrackingLookup
    const orderRef = (body.orderRef || '').trim()
    const emailOrPhone = (body.emailOrPhone || '').trim()

    if (!orderRef || !emailOrPhone) {
      return NextResponse.json(
        { error: 'Order code and email or phone are required.' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderCode: orderRef },
          ...(Number.isFinite(Number(orderRef)) ? [{ id: Number(orderRef) }] : []),
        ],
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'No order found with that information.' },
        { status: 404 }
      )
    }

    const matchesEmail = isValidEmail(emailOrPhone) && order.email && order.email.toLowerCase() === emailOrPhone.toLowerCase()
    const matchesPhone = isValidPhone(emailOrPhone) && order.phone && normalizePhone(order.phone) === normalizePhone(emailOrPhone)

    if (!matchesEmail && !matchesPhone) {
      return NextResponse.json(
        { error: 'No order found with that information.' },
        { status: 404 }
      )
    }

    const timeline = buildStatusTimeline(order.status, order.createdAt.toISOString(), order.updatedAt.toISOString())

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderCode: order.orderCode,
        name: order.name,
        email: order.email,
        phone: order.phone,
        product: order.product,
        size: order.size,
        color: order.color,
        quantity: order.quantity,
        designNotes: order.designNotes,
        designFileName: order.designFileName,
        deadline: order.deadline,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      timeline,
    })
  } catch (error) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      { error: 'Failed to track order.' },
      { status: 500 }
    )
  }
}
