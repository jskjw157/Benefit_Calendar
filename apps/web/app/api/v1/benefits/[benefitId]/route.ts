import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

export async function GET(
  request: NextRequest,
  { params }: { params: { benefitId: string } }
) {
  const { benefitId } = params

  const benefit = sampleData.benefits.find(b => b.id === benefitId)

  if (!benefit) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Benefit with id '${benefitId}' not found`
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: benefit,
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
  })
}
