'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

interface MonthSelectorProps {
  year: number
  month: number // 0-indexed
  onPrev: () => void
  onNext: () => void
}

export function MonthSelector({ year, month, onPrev, onNext }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button onClick={onPrev} aria-label="이전 달" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <ChevronLeft className="h-5 w-5 text-slate-600" />
      </button>
      <h2 className="text-lg font-semibold text-slate-900">
        {year}년 {MONTH_NAMES[month]}
      </h2>
      <button onClick={onNext} aria-label="다음 달" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
        <ChevronRight className="h-5 w-5 text-slate-600" />
      </button>
    </div>
  )
}
