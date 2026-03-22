import { Benefit } from '@/shared/types/benefit.types'

export interface UserProfile {
  age: number
  region: string
  employmentStatus: 'JOB_SEEKER' | 'EMPLOYED' | 'STUDENT' | 'SELF_EMPLOYED'
  interests: string[] // ['주거', '창업', ...]
  viewHistory: string[] // benefit IDs
  bookmarkedCategories: string[]
}

export interface ScoredBenefit extends Benefit {
  score: number
  reasons: string[]
}

export class RecommendationEngine {
  /**
   * Multi-dimensional scoring algorithm:
   * - Profile matching (40%)
   * - Behavioral patterns (30%)
   * - Urgency (20%)
   * - Popularity (10%)
   */
  static recommend(
    benefits: Benefit[],
    profile: UserProfile,
    limit = 5
  ): ScoredBenefit[] {
    return benefits
      .map(benefit => {
        let score = 0
        const reasons: string[] = []

        // 1. Profile matching (0-40 points)
        if (benefit.region === profile.region || benefit.region === '전국') {
          score += 15
          reasons.push('지역 일치')
        }

        if (profile.interests.includes(benefit.category)) {
          score += 25
          reasons.push('관심 분야')
        }

        // Age matching for specific benefits
        if (
          benefit.requirements?.some(req =>
            req.includes('19') && profile.age >= 19 && profile.age <= 34
          )
        ) {
          score += 5
        }

        // 2. Behavioral patterns (0-30 points)
        const categoryViews = profile.viewHistory.filter(id => {
          const viewedBenefit = benefits.find(b => b.id === id)
          return viewedBenefit?.category === benefit.category
        }).length

        score += Math.min(categoryViews * 5, 20)
        if (categoryViews > 0) {
          reasons.push('자주 보는 카테고리')
        }

        if (profile.bookmarkedCategories.includes(benefit.category)) {
          score += 10
          reasons.push('자주 저장하는 카테고리')
        }

        // 3. Urgency (0-20 points)
        const daysLeft = Math.floor(
          (new Date(benefit.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )

        if (daysLeft <= 7 && daysLeft > 0) {
          score += 20
          reasons.push('마감 임박')
        } else if (daysLeft <= 14 && daysLeft > 0) {
          score += 10
          reasons.push('2주 내 마감')
        }

        // 4. Popularity (0-10 points) - Mock based on ID
        const popularityScore = parseInt(benefit.id.split('_')[1] || '0', 10) % 10
        score += popularityScore

        // Filter out past deadlines
        if (daysLeft < 0) {
          score = 0
        }

        return { ...benefit, score, reasons }
      })
      .filter(b => b.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  }

  /**
   * Get personalized insights based on user profile
   */
  static getInsights(profile: UserProfile): string[] {
    const insights: string[] = []

    if (profile.employmentStatus === 'JOB_SEEKER') {
      insights.push('취업 준비생을 위한 교통비, 교육 지원이 많습니다')
    }

    if (profile.age <= 34) {
      insights.push('청년 대상 주거 지원 혜택을 확인해보세요')
    }

    if (profile.interests.includes('창업')) {
      insights.push('창업 공간 및 자금 지원 프로그램이 준비되어 있습니다')
    }

    if (profile.bookmarkedCategories.length > 0) {
      const topCategory = profile.bookmarkedCategories[0]
      insights.push(`${topCategory} 분야의 신규 혜택을 우선 추천합니다`)
    }

    return insights
  }
}
