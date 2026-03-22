'use client'

import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type SortOption = 'deadline:asc' | 'amount:desc' | 'recent' | 'popular'

interface SortSelectProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'deadline:asc', label: '마감일 임박순' },
  { value: 'amount:desc', label: '지원금 높은순' },
  { value: 'recent', label: '최신 등록순' },
  { value: 'popular', label: '인기순' }
]

export function SortSelect({ value, onChange }: SortSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = OPTIONS.find(opt => opt.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-700">
          {selected?.label}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-10 overflow-hidden"
          >
            {OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span className={value === option.value ? 'font-medium text-blue-600' : 'text-slate-700'}>
                  {option.label}
                </span>
                {value === option.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
