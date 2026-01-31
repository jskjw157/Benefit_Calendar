"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles, TrendingUp, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export function DashboardHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div ref={ref} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 md:p-12 text-white shadow-2xl shadow-blue-900/20">
      {/* Background decoration with parallax */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 -mb-20 -ml-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 flex flex-col items-start gap-6 max-w-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-blue-50 backdrop-blur-md border border-white/20 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
            <span>오늘 새로운 혜택 3개가 도착했어요!</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-4">
            안녕하세요, 김청년님 👋
            <br />
            <span className="text-blue-100">놓치기 아까운 혜택이 기다려요</span>
          </h1>
          
          <p className="text-lg text-blue-100/90 leading-relaxed mb-6 max-w-lg">
            이번 달 신청 가능한 청년 지원금이 2건 남았습니다.
            <br className="hidden md:block" />
            마감일이 지나기 전에 확인해보세요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 border-0 font-semibold shadow-xl shadow-blue-900/10"
          >
            추천 혜택 보기
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            variant="glass" 
            size="lg" 
            className="text-white hover:bg-white/20 border-white/30"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            이번 달 일정 확인
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
