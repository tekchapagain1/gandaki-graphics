/**
 * Server-side Cloudinary helper for image uploads.
 *
 * Requires the following environment variables:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 *
 * If any of these are missing the functions return `null` so the caller
 * can fall back to local disk storage.
 */

import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary'

function isConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  )
}

function configure() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

/** Options for uploadBuffer */
export interface CloudinaryUploadOptions {
  /** Cloudinary folder (e.g. 'gallery', 'designs') */
  folder?: string
  /** Resource type (defaults to 'image') */
  resourceType?: 'image' | 'raw' | 'auto'
  /** Optional explicit public_id; Cloudinary generates one if omitted */
  publicId?: string
}

/** Result returned on successful upload */
export interface CloudinaryUploadResult {
  /** Secure CDN URL */
  url: string
  /** Cloudinary public_id (needed for deletion) */
  publicId: string
}

/**
 * Upload a file Buffer to Cloudinary.
 * Returns `null` when Cloudinary is not configured or the upload fails.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult | null> {
  if (!isConfigured()) {
    return null
  }

  configure()

  const { folder = 'gandaki-graphics', resourceType = 'auto', publicId } = options

  return new Promise((resolve) => {
    const uploadOptions: UploadApiOptions = {
      folder,
      resource_type: resourceType,
      ...(publicId ? { public_id: publicId } : {}),
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error || !result) {
        console.error('Cloudinary upload error:', error)
        resolve(null)
      } else {
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        })
      }
    })

    stream.end(buffer)
  })
}

/**
 * Delete an asset from Cloudinary by its public_id.
 * Silently no-ops when Cloudinary is not configured.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'raw' | 'auto' = 'image'
): Promise<void> {
  if (!isConfigured()) return

  configure()

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch (err) {
    console.warn(`Cloudinary deletion failed for ${publicId}:`, err)
  }
}

/**
 * Extract the Cloudinary public_id from a secure URL.
 * Returns null if the URL is not a Cloudinary URL.
 *
 * Example URL:
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/gallery/abc123.png
 * Extracted public_id:
 *   gallery/abc123
 */
export function extractPublicId(url: string): string | null {
  if (!url.includes('res.cloudinary.com')) return null

  try {
    // Remove extension, then extract everything after /upload/v.../
    const withoutExt = url.replace(/\.[^/.]+$/, '')
    const match = withoutExt.match(/\/upload\/(?:v\d+\/)?(.+)$/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

/** Returns true if the URL points to a Cloudinary CDN asset */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com')
}
