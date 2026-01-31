"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/shared/lib/utils"

// Mock Data (Consistent with main calendar)
const EVENTS = [
  { date: 25, type: "deadline" },
  { date: 28, type: "start" },
  { date: 15, type: "deadline" },
]

export function MiniCalendarWidget() {
  const [currentDate] = React.useState(new Date(2026, 1, 1)) // Feb 2026
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay }, (_, i) => i)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="font-semibold text-slate-900">
          {currentDate.getMonth() + 1}월
        </span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {blanks.map((blank) => (
          <div key={`blank-${blank}`} />
        ))}
        {days.map((day) => {
          const event = EVENTS.find(e => e.date === day)
          const isToday = day === 1 // Mock today
          
          return (
            <div
              key={day}
              className="flex flex-col items-center justify-start py-1 relative group cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
            >
              <span className={cn(
                "text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full",
                isToday ? "bg-blue-600 text-white" : "text-slate-600"
              )}>
                {day}
              </span>
              {event && (
                <div className={cn(
                  "mt-1 w-1.5 h-1.5 rounded-full",
                  event.type === 'deadline' ? "bg-orange-500" : "bg-blue-500"
                )} />
              )}
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 flex gap-3 text-xs text-slate-500 px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span>마감</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>시작</span>
        </div>
      </div>
    </div>
  )
}
