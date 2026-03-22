import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

const MOCK_USER_ID = 'u_001'

// In-memory store for notification settings
let notificationSettings = {
  channel: sampleData.users.find(u => u.id === MOCK_USER_ID)?.notificationChannel || 'EMAIL',
  enabled: true,
  leadDays: 3
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: notificationSettings,
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
  })
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // Merge updates
    notificationSettings = {
      ...notificationSettings,
      ...body
    }

    return NextResponse.json({
      success: true,
      data: notificationSettings,
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Invalid JSON in request body'
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }
    }, { status: 400 })
  }
}
