"use client"

import { motion } from "framer-motion"
import { DashboardHero } from "@/components/dashboard/hero-section"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { MiniCalendarWidget } from "@/components/dashboard/mini-calendar-widget"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Flame } from "lucide-react"

// Sample Data
const urgentBenefits = [
  { id: 1, title: "청년월세 특별지원", dday: "D-5", agency: "국토교통부" },
  { id: 2, title: "청년희망적금", dday: "D-2", agency: "서민금융진흥원" },
]

const newBenefits = [
  { id: 3, title: "경기도 청년기본소득", date: "오늘", category: "생활" },
  { id: 4, title: "내일배움카드", date: "어제", category: "교육" },
  { id: 5, title: "K-패스", date: "2일전", category: "교통" },
]

export function BentoGridDashboard() {
  return (
    <div className="container p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Hero & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardHero />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <StatsOverview />
        </div>
      </div>

      {/* 2. Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 grid-rows-[auto_auto]">
        
        {/* A. Urgent Benefits (마감 임박) - 2x1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 lg:col-span-2"
        >
          <Card className="h-full border-orange-100 bg-orange-50/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>마감 임박 혜택</CardTitle>
                  <p className="text-xs text-muted-foreground">곧 신청이 마감돼요!</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-100">
                전체보기
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {urgentBenefits.map((benefit, i) => (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-900">{benefit.title}</h4>
                      <span className="text-xs text-slate-500">{benefit.agency}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                      {benefit.dday}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* B. Calendar Widget (캘린더 복구) - 1x1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1 lg:col-span-1 row-span-2"
        >
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <MiniCalendarWidget />
            </CardContent>
          </Card>
        </motion.div>

        {/* C. Profile Progress (프로필) - 1x1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block lg:col-span-1"
        >
           <Card className="h-full bg-blue-50/50 border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900 text-lg">내 프로필</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-blue-700">
                  <span>완성도 80%</span>
                </div>
                <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-blue-500 rounded-full" />
                </div>
                <Button size="sm" className="w-full bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-sm">
                  이어서 작성하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* D. New Benefits (신규 혜택) - 2x1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2 lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>새로 뜬 혜택</CardTitle>
              <Button variant="ghost" size="sm">더보기 <ArrowRight className="h-3 w-3 ml-1" /></Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {newBenefits.map((benefit, i) => (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + 0.1 * i }}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <div>
                        <h4 className="text-sm font-medium text-slate-900">{benefit.title}</h4>
                        <span className="text-xs text-slate-500">{benefit.category}</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{benefit.date}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}