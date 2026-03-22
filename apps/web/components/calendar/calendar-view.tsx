"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/shared/lib/utils"
import { useCalendar } from "@/shared/hooks/use-calendar"
import { benefitService } from "@/shared/services/benefit.service"
import { Benefit } from "@/shared/types/benefit.types"

interface CalendarEvent {
  date: number
  title: string
  type: "deadline" | "start"
  benefitId: string
}

export function CalendarView() {
  const { year, month, days: calendarDays, selectedDate, nextMonth, prevMonth, selectDate } = useCalendar()
  const [events, setEvents] = React.useState<CalendarEvent[]>([])

  React.useEffect(() => {
    benefitService.getList().then((data) => {
      const mapped: CalendarEvent[] = []
      data.items.forEach((b: Benefit) => {
        const deadlineDate = new Date(b.deadline)
        if (deadlineDate.getFullYear() === year && deadlineDate.getMonth() === month) {
          mapped.push({ date: deadlineDate.getDate(), title: `${b.title} 마감`, type: "deadline", benefitId: b.id })
        }
        if (b.applyPeriod) {
          const startDate = new Date(b.applyPeriod.start)
          if (startDate.getFullYear() === year && startDate.getMonth() === month) {
            mapped.push({ date: startDate.getDate(), title: `${b.title} 신청 시작`, type: "start", benefitId: b.id })
          }
        }
      })
      setEvents(mapped)
    }).catch(() => setEvents([]))
  }, [year, month])

  const days = calendarDays.map(d => d === null ? null : d)
  const blanks = days.filter(d => d === null)
  const actualDays = days.filter((d): d is number => d !== null)

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          {year}년 {month + 1}월
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full hover:bg-white border-slate-200" onClick={prevMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full hover:bg-white border-slate-200" onClick={nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <motion.div 
        layout
        className="grid grid-cols-7 gap-4"
      >
        {blanks.map((_, idx) => (
          <div key={`blank-${idx}`} className="h-32 md:h-40 rounded-3xl" />
        ))}

        {actualDays.map((day, i) => {
          const event = events.find(e => e.date === day)
          const isSelected = selectedDate === day

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => selectDate(day)}
              className={cn(
                "relative h-32 md:h-40 rounded-3xl p-4 transition-all duration-300 cursor-pointer border group overflow-hidden",
                isSelected 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105 z-10 border-transparent" 
                  : "bg-white/60 hover:bg-white border-white/40 hover:border-blue-200 hover:shadow-lg"
              )}
            >
              <span className={cn(
                "text-lg font-bold",
                isSelected ? "text-white" : "text-slate-700"
              )}>
                {day}
              </span>

              {event && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2"
                >
                  <div className={cn(
                    "text-xs p-2 rounded-xl font-medium leading-tight",
                    isSelected 
                      ? "bg-white/20 text-white" 
                      : event.type === 'deadline' 
                        ? "bg-orange-50 text-orange-600" 
                        : "bg-blue-50 text-blue-600"
                  )}>
                    {event.title}
                  </div>
                </motion.div>
              )}

              {/* Decorative Gradient on Hover */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Selected Day Details (Bottom Sheet style for Mobile / Side panel for Desktop could be better, but inline for now) */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-2xl border-t border-slate-200 rounded-t-[2.5rem] shadow-2xl z-40 md:static md:mt-12 md:bg-white/60 md:border md:rounded-3xl md:shadow-none"
          >
            <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {month + 1}월 {selectedDate}일
                </h3>
                <p className="text-slate-500">
                  {(() => {
                    const dayEvents = events.filter(e => e.date === selectedDate)
                    const deadlines = dayEvents.filter(e => e.type === 'deadline').length
                    const starts = dayEvents.filter(e => e.type === 'start').length
                    return `신청 마감 ${deadlines}건 · 접수 시작 ${starts}건`
                  })()}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => selectDate(0)}
              >
                <ChevronRight className="h-6 w-6 rotate-90" />
              </Button>
            </div>

            <div className="max-w-5xl mx-auto grid gap-4">
               {events.filter(e => e.date === selectedDate).map((ev, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex items-center gap-4">
                     <div className={cn(
                       "h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm",
                       ev.type === 'deadline' ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                     )}>
                       {ev.type === 'deadline' ? '마감' : '시작'}
                     </div>
                     <div>
                       <h4 className="font-bold text-slate-900">{ev.title}</h4>
                     </div>
                   </div>
                   <Button size="icon" variant="ghost" className="rounded-full">
                     <ArrowRight className="h-5 w-5 text-slate-400" />
                   </Button>
                 </div>
               ))}
               {events.filter(e => e.date === selectedDate).length === 0 && (
                 <p className="text-center text-slate-400 py-4">이 날짜에 혜택 일정이 없습니다.</p>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
