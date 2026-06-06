import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSuspiciousActivityLog } from '@/lib/security'

/**
 * Admin endpoint to view suspicious activity logs
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get limit from query parameter
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100', 10), 500)

    const activityLog = getSuspiciousActivityLog(limit)

    return NextResponse.json(
      {
        success: true,
        count: activityLog.length,
        logs: activityLog,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching security logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security logs' },
      { status: 500 }
    )
  }
}
