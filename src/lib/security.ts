/**
 * Security utilities for protecting against spam, bot attacks, and abuse
 * Implements rate limiting, validation, and monitoring
 */

import { headers } from 'next/headers'

// In-memory rate limit store (use Redis in production)
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests in that window
  keyGenerator?: (request: Request) => string
}

/**
 * Rate limit middleware for orders
 * Default: 5 orders per IP per hour
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (request: Request) => {
    const key = config.keyGenerator ? config.keyGenerator(request) : getClientIP(request)

    const now = Date.now()
    const entry = rateLimitStore.get(key)

    if (!entry || now > entry.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      return { allowed: true, remaining: config.maxRequests - 1 }
    }

    if (entry.count < config.maxRequests) {
      entry.count++
      return { allowed: true, remaining: config.maxRequests - entry.count }
    }

    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    }
  }
}

/**
 * Extract client IP address from request
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')

  if (forwarded) return forwarded.split(',')[0].trim()
  if (real) return real
  return 'unknown'
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate phone number (basic)
 * Accepts various formats: 9800000000, 980-000-0000, etc.
 */
export function isValidPhone(phone: string): boolean {
  // Remove common formatting characters
  const cleaned = phone.replace(/[-.\s()]/g, '')
  // Check if it's 10 digits (Nepal standard)
  return /^\d{10}$/.test(cleaned)
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500) // Limit length
    .replace(/[<>\"']/g, '') // Remove HTML-like characters
}

/**
 * Validate order submission data
 */
export interface OrderSubmission {
  name: string
  email: string
  phone: string
  product: string
  quantity: string
  size?: string
  color?: string
  designNotes?: string
  deadline?: string
}

export function validateOrderSubmission(data: OrderSubmission): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validate name
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters')
  }
  if (data.name.length > 100) {
    errors.push('Name too long (max 100 characters)')
  }

  // Validate email
  if (!isValidEmail(data.email)) {
    errors.push('Invalid email address')
  }

  // Validate phone
  if (!isValidPhone(data.phone)) {
    errors.push('Phone number must be 10 digits')
  }

  // Validate product
  const validProducts = ['T-shirt', 'Hoodie', 'Cup']
  if (!data.product || !validProducts.includes(data.product)) {
    errors.push('Invalid product selected')
  }

  // Validate quantity
  const qty = parseInt(data.quantity, 10)
  if (isNaN(qty) || qty < 1 || qty > 10000) {
    errors.push('Quantity must be between 1 and 10,000')
  }

  // Validate optional fields
  if (data.size && !['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'].includes(data.size)) {
    errors.push('Invalid size selected')
  }

  if (data.color && data.color.length > 50) {
    errors.push('Color description too long')
  }

  if (data.designNotes && data.designNotes.length > 1000) {
    errors.push('Design notes too long (max 1000 characters)')
  }

  if (data.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(data.deadline)) {
    errors.push('Invalid deadline date format')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Detect suspicious patterns (bot-like behavior)
 */
export function detectSuspiciousOrder(data: OrderSubmission): string[] {
  const warnings: string[] = []

  // Check for spam-like email patterns
  if (
    data.email.includes('test') ||
    data.email.includes('spam') ||
    data.email.includes('temp') ||
    data.email.includes('bot')
  ) {
    warnings.push('Suspicious email pattern')
  }

  // Check for spam-like names
  const name = data.name.toLowerCase()
  if (
    name.includes('click') ||
    name.includes('buy') ||
    name.includes('free') ||
    name.includes('promo') ||
    name.includes('admin') ||
    name === 'test'
  ) {
    warnings.push('Suspicious name pattern')
  }

  // Check for extreme quantities
  const qty = parseInt(data.quantity, 10)
  if (qty > 1000) {
    warnings.push('Very high quantity order')
  }

  // Check for past deadlines
  if (data.deadline) {
    const deadline = new Date(data.deadline)
    if (deadline < new Date()) {
      warnings.push('Deadline is in the past')
    }
  }

  // Check design notes for spam keywords
  if (data.designNotes) {
    const notes = data.designNotes.toLowerCase()
    if (notes.includes('click here') || notes.includes('buy now') || notes.includes('casino')) {
      warnings.push('Spam keywords detected in notes')
    }
  }

  return warnings
}

/**
 * Log suspicious activity for admin review
 */
export interface SuspiciousActivityLog {
  timestamp: Date
  type: 'spam_attempt' | 'rate_limit' | 'validation_fail' | 'suspicious_pattern'
  ip: string
  email?: string
  reason: string
  data?: unknown
}

const activityLogs: SuspiciousActivityLog[] = []

export function logSuspiciousActivity(log: Omit<SuspiciousActivityLog, 'timestamp'>) {
  const entry: SuspiciousActivityLog = {
    ...log,
    timestamp: new Date(),
  }
  activityLogs.push(entry)

  // Keep only last 1000 entries (use DB in production)
  if (activityLogs.length > 1000) {
    activityLogs.shift()
  }

  console.warn(`⚠️  [${log.type}] ${log.reason}`)
  return entry
}

/**
 * Get recent suspicious activities
 */
export function getSuspiciousActivityLog(limit: number = 50) {
  return activityLogs.slice(-limit)
}

/**
 * Check if IP is already flagged
 */
export function isIPFlagged(ip: string): boolean {
  const recentAttempts = activityLogs.filter(
    (log) => log.ip === ip && Date.now() - log.timestamp.getTime() < 3600000 // Last hour
  )
  return recentAttempts.length > 5
}
