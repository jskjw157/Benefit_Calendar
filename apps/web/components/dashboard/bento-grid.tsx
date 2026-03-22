"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import dynamic from "next/dynamic"
import { DashboardHero } from "@/components/dashboard/hero-section"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { AIRecommendations } from "@/components/dashboard/ai-recommendations"
import { WeeklySchedule } from "@/components/dashboard/weekly-schedule"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Flame } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { Benefit } from "@/shared/types/benefit.types"
import { UserProfile } from "@/shared/lib/recommendation-engine"
import { benefitService } from "@/shared/services/benefit.service"

const MiniCalendarWidget = dynamic(
  () => import("@/components/dashboard/mini-calendar-widget").then(mod => ({ default: mod.MiniCalendarWidget })),
  {
    loading: () => <div className="animate-pulse h-full bg-slate-100 rounded-xl" />,
    ssr: false
  }
)

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

function TiltCard3D({ benefit }: { benefit: typeof urgentBenefits[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-50, 50], [5, -5])
  const rotateY = useTransform(x, [-50, 50], [-5, 5])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const mouseX = e.clientX - rect.left - centerX
    const mouseY = e.clientY - rect.top - centerY
    x.set(mouseX)
    y.set(mouseY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="flex items-center justify-between p-3 rounded-2xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div style={{ transform: "translateZ(20px)" }}>
        <h4 className="font-semibold text-slate-900">{benefit.title}</h4>
        <span className="text-xs text-slate-500">{benefit.agency}</span>
      </div>
      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold" style={{ transform: "translateZ(30px)" }}>
        {benefit.dday}
      </span>
    </motion.div>
  )
}

export function BentoGridDashboard() {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)

  // Mock user profile (in production, fetch from auth context)
  const userProfile: UserProfile = {
    age: 25,
    region: '서울',
    employmentStatus: 'JOB_SEEKER',
    interests: ['주거', '교육'],
    viewHistory: ['b_001', 'b_002', 'b_006'],
    bookmarkedCategories: ['주거', '생활']
  }

  useEffect(() => {
    benefitService.getList()
      .then(data => {
        setBenefits(data.items)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
                {urgentBenefits.map((benefit) => (
                  <TiltCard3D key={benefit.id} benefit={benefit} />
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

        {/* C. Weekly Schedule (주간 일정) - 1x1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block lg:col-span-1"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <WeeklySchedule />
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