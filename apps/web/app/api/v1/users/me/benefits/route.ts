import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

const MOCK_USER_ID = 'u_001'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const statusFilter = searchParams.get('status') || ''

  // Get user's benefits
  let userBenefits = sampleData.userBenefits.filter(
    ub => ub.userId === MOCK_USER_ID
  )

  // Apply status filter
  if (statusFilter) {
    userBenefits = userBenefits.filter(ub => ub.status === statusFilter)
  }

  // Join with benefits data
  const items = userBenefits.map(ub => {
    const benefit = sampleData.benefits.find(b => b.id === ub.benefitId)
    return {
      ...benefit,
      benefitId: ub.benefitId,
      status: ub.status,
      createdAt: ub.createdAt
    }
  })

  return NextResponse.json({
    success: true,
    data: {
      items,
      total: items.length
    },
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      filters: {
        status: statusFilter || null
      }
    }
  })
}
