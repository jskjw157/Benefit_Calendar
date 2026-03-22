import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

const MOCK_USER_ID = 'u_001'

// In-memory store for userBenefit updates
const userBenefitsCache = new Map<string, any>(
  sampleData.userBenefits
    .filter(ub => ub.userId === MOCK_USER_ID)
    .map(ub => [`${ub.userId}_${ub.benefitId}`, { ...ub }])
)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { benefitId: string } }
) {
  const { benefitId } = params

  try {
    const body = await request.json()

    if (!body.status) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'status is required'
        },
        meta: {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        }
      }, { status: 400 })
    }

    const key = `${MOCK_USER_ID}_${benefitId}`
    const userBenefit = userBenefitsCache.get(key)

    if (!userBenefit) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Benefit '${benefitId}' not found for user`
        },
        meta: {
          requestId: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        }
      }, { status: 404 })
    }

    // Update status in cache
    userBenefit.status = body.status
    userBenefitsCache.set(key, userBenefit)

    return NextResponse.json({
      success: true,
      data: userBenefit,
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
