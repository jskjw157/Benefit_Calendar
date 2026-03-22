'use client'
import { useState, useMemo, useCallback } from 'react'

export function useCalendar() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  const nextMonth = useCallback(() => {
    setMonth(prev => {
      if (prev === 11) { setYear(y => y + 1); return 0 }
      return prev + 1
    })
    setSelectedDate(null)
  }, [])

  const prevMonth = useCallback(() => {
    setMonth(prev => {
      if (prev === 0) { setYear(y => y - 1); return 11 }
      return prev - 1
    })
    setSelectedDate(null)
  }, [])

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const result: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) result.push(null)
    for (let i = 1; i <= daysInMonth; i++) result.push(i)
    return result
  }, [year, month])

  const selectDate = useCallback((day: number) => setSelectedDate(day), [])

  return { year, month, days, selectedDate, nextMonth, prevMonth, selectDate }
}
