'use client'

import { useEffect, useState } from 'react'
import { Benefit } from '@/shared/types/benefit.types'
import { benefitService, type BenefitListParams } from '@/shared/services/benefit.service'

interface UseBenefitsParams {
  q?: string
  category?: string
  region?: string
  status?: string
}

export function useBenefits(params: UseBenefitsParams = {}) {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBenefits = async () => {
      setLoading(true)
      setError(null)

      try {
        const serviceParams: BenefitListParams = {
          q: params.q,
          category: params.category,
          region: params.region,
          status: params.status,
        }

        const data = await benefitService.getList(serviceParams)
        setBenefits(data.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러올 수 없습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchBenefits()
  }, [params.q, params.category, params.region, params.status])

  return { benefits, loading, error, refetch: () => {} }
}
