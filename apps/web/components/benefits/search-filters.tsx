"use client"

import { Search, Filter, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/shared/lib/utils"

interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="w-full pl-11 pr-4 py-4 bg-white/50 backdrop-blur-xl border border-white/40 rounded-full shadow-lg shadow-blue-500/5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all text-slate-900 placeholder:text-slate-400"
          placeholder="어떤 혜택을 찾고 계신가요? (예: 월세 지원, 취업 장려금)"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <Button size="sm" variant="gradient" className="rounded-full h-10 px-6">
            검색
          </Button>
        </div>
      </div>
    </div>
  )
}

interface FilterProps {
  label: string
  active?: boolean
  onClick?: () => void
}

export function FilterChip({ label, active, onClick }: FilterProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
          : "bg-white/50 text-slate-600 border-white/40 hover:bg-white hover:border-blue-200"
      )}
    >
      {label}
    </button>
  )
}
