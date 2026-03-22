"use client"

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp } from 'lucide-react'
import { RecommendationEngine, UserProfile } from '@/shared/lib/recommendation-engine'
import { Benefit } from '@/shared/types/benefit.types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AIRecommendationsProps {
  benefits: Benefit[]
  userProfile: UserProfile
}

export function AIRecommendations({ benefits, userProfile }: AIRecommendationsProps) {
  const recommended = useMemo(
    () => RecommendationEngine.recommend(benefits, userProfile, 3),
    [benefits, userProfile]
  )

  const insights = useMemo(
    () => RecommendationEngine.getInsights(userProfile),
    [userProfile]
  )

  return (
    <Card className="h-full bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-100 rounded-xl text-violet-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-violet-900">AI 맞춤 추천</CardTitle>
            <p className="text-xs text-violet-600 mt-1">당신을 위한 특별한 혜택</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="p-3 bg-white/50 rounded-xl border border-violet-100">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-violet-700">{insights[0]}</p>
            </div>
          </div>
        )}

        {/* Recommended Benefits */}
        {recommended.length === 0 ? (
          <div className="text-center py-6 text-violet-400">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">추천 가능한 혜택이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommended.map((benefit, i) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-violet-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-slate-900 mb-1">
                      {benefit.title}
                    </h4>
                    <p className="text-xs text-slate-500">{benefit.agency}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 font-semibold">
                      {Math.round(benefit.score)}점
                    </span>
                  </div>
                </div>

                {/* Recommendation Reasons */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {benefit.reasons.slice(0, 3).map((reason, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-100"
                    >
                      {reason}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
