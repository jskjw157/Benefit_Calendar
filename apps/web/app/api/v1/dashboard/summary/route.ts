import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

const MOCK_USER_ID = 'u_001'

export async function GET(request: NextRequest) {
  // Get current user's benefits
  const userBenefits = sampleData.userBenefits.filter(
    ub => ub.userId === MOCK_USER_ID
  )

  // Calculate matched count (total benefits for user)
  const matchedCount = userBenefits.length

  // Calculate applied count (APPLIED + RECEIVED status)
  const appliedCount = userBenefits.filter(
    ub => ub.status === 'APPLIED' || ub.status === 'RECEIVED'
  ).length

  // Calculate urgent count (deadline within 7 days)
  const now = new Date()
  const sevenDaysFromNow = new Date(now)
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  const userBenefitIds = userBenefits.map(ub => ub.benefitId)
  const urgentCount = sampleData.benefits.filter(b => {
    if (!userBenefitIds.includes(b.id)) return false
    if (b.status !== 'OPEN') return false

    const deadline = new Date(b.deadline)
    return deadline >= now && deadline <= sevenDaysFromNow
  }).length

  return NextResponse.json({
    success: true,
    data: {
      matchedCount,
      urgentCount,
      appliedCount
    },
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
  })
}
