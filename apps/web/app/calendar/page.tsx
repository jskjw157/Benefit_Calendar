"use client"

import { CalendarView } from "@/components/calendar/calendar-view"
import { motion } from "framer-motion"

export default function CalendarPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[100px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center md:text-left"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">
            혜택 캘린더
          </h1>
          <p className="text-lg text-slate-500">
            중요한 신청 일정을 놓치지 않게 관리하세요.
          </p>
        </motion.div>

        <CalendarView />
      </div>
    </div>
  )
}
