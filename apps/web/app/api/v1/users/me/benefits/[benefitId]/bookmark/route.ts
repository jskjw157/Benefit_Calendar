import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

const MOCK_USER_ID = 'u_001'

// In-memory store for bookmarks
const bookmarksCache = new Map<string, boolean>(
  sampleData.userBenefits
    .filter(ub => ub.userId === MOCK_USER_ID)
    .map(ub => [`${ub.userId}_${ub.benefitId}`, ub.status === 'BOOKMARKED'])
)

export async function POST(
  request: NextRequest,
  { params }: { params: { benefitId: string } }
) {
  const { benefitId } = params

  // Check if benefit exists
  const benefit = sampleData.benefits.find(b => b.id === benefitId)

  if (!benefit) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Benefit '${benefitId}' not found`
      },
      meta: {
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }
    }, { status: 404 })
  }

  const key = `${MOCK_USER_ID}_${benefitId}`
  const currentBookmarked = bookmarksCache.get(key) || false

  // Toggle bookmark
  const newBookmarked = !currentBookmarked
  bookmarksCache.set(key, newBookmarked)

  return NextResponse.json({
    success: true,
    data: {
      benefitId,
      bookmarked: newBookmarked
    },
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
  })
}
