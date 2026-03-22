'use client'

import { Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface ScheduleEvent {
  id: string
  title: string
  date: string
  type: 'deadline' | 'start' | 'announcement'
  dday: string
}

const MOCK_EVENTS: ScheduleEvent[] = [
  {
    id: '1',
    title: '청년월세 지원 마감',
    date: '2026-02-06',
    type: 'deadline',
    dday: 'D-5'
  },
  {
    id: '2',
    title: '청년 창업 지원금 신청 시작',
    date: '2026-02-03',
    type: 'start',
    dday: 'D-2'
  },
  {
    id: '3',
    title: '주거 패키지 지원 공고',
    date: '2026-02-04',
    type: 'announcement',
    dday: 'D-3'
  }
]

export function WeeklySchedule() {
  const typeColors = {
    deadline: 'bg-orange-100 text-orange-600',
    start: 'bg-blue-100 text-blue-600',
    announcement: 'bg-violet-100 text-violet-600'
  }

  const typeLabels = {
    deadline: '마감',
    start: '시작',
    announcement: '공고'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">이번 주 일정</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700">
          전체보기
        </button>
      </div>

      <div className="space-y-2">
        {MOCK_EVENTS.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="shrink-0">
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${typeColors[event.type]}`}>
                {event.dday}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${typeColors[event.type]}`}>
                  {typeLabels[event.type]}
                </span>
              </div>
              <div className="font-medium text-sm text-slate-900 truncate">
                {event.title}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <Clock className="h-3 w-3" />
                {event.date}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
