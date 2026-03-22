import { NextRequest, NextResponse } from 'next/server'
import sampleData from '@/shared/sample_data.json'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const region = searchParams.get('region') || ''
  const status = searchParams.get('status') || ''

  let filtered = sampleData.benefits

  // Search query filter
  if (q) {
    const query = q.toLowerCase()
    filtered = filtered.filter(b =>
      b.title.toLowerCase().includes(query) ||
      b.agency.toLowerCase().includes(query) ||
      b.category.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (category) {
    filtered = filtered.filter(b => b.category === category)
  }

  // Region filter
  if (region) {
    filtered = filtered.filter(b => b.region === region || b.region === '전국')
  }

  // Status filter
  if (status) {
    filtered = filtered.filter(b => b.status === status)
  }

  return NextResponse.json({
    success: true,
    data: {
      items: filtered,
      total: filtered.length,
      page: 1,
      pageSize: filtered.length
    },
    meta: {
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      filters: {
        q: q || null,
        category: category || null,
        region: region || null,
        status: status || null
      }
    }
  })
}
