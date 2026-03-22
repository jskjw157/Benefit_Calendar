import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'email and password are required'
        },
        meta: {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        }
      }, { status: 400 })
    }

    // Find user by email
    const user = sampleData.users.find(u => u.email === email)

    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        },
        meta: {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        }
      }, { status: 401 })
    }

    // Generate mock JWT token
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        exp: Date.now() + 3600000 // 1 hour
      })
    ).toString('base64')

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          age: user.age,
          region: user.region
        }
      },
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
