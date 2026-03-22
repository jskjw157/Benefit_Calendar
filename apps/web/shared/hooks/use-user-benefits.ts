'use client'
import { useEffect, useState } from 'react'
import { userBenefitService } from '@/shared/services/user-benefit.service'
import type { UserBenefit, UserBenefitStatus } from '@/shared/types/user.types'

export function useUserBenefits(status?: UserBenefitStatus) {
  const [userBenefits, setUserBenefits] = useState<UserBenefit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await userBenefitService.getList(status)
        setUserBenefits(data.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [status])

  return { userBenefits, loading, error }
}
