"use client"

import { useState, Suspense } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { SearchBar, FilterChip } from "@/components/benefits/search-filters"
import { SortSelect, SortOption } from "@/components/benefits/sort-select"
import { useBenefits } from "@/shared/hooks/use-benefits"

const BenefitList = dynamic(
  () => import("@/components/benefits/benefit-list").then(mod => ({ default: mod.BenefitList })),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse h-80 bg-slate-200 rounded-3xl" />
        ))}
      </div>
    ),
    ssr: false
  }
)

const CATEGORIES = ["전체", "주거", "생활", "교통", "교육", "창업", "의료"]

export default function BenefitsPage() {
  const [activeCategory, setActiveCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>('deadline:asc')

  // Real API call
  const { benefits, loading, error } = useBenefits({
    q: searchQuery,
    category: activeCategory === "전체" ? undefined : activeCategory,
    status: "OPEN"
  })

  const filteredBenefits = benefits

  return (
    <div className="min-h-screen pb-20">
      {/* Header Section */}
      <div className="relative pt-24 pb-12 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-blue-500/5 blur-[100px] -z-10" />
        
        <div className="container mx-auto text-center max-w-3xl space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
          >
            나에게 딱 맞는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">혜택 찾기</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500"
          >
            정부와 지자체에서 제공하는 다양한 지원 정책을 한눈에 확인하세요.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4"
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </motion.div>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <FilterChip
                label={cat}
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-10">
          <div className="text-sm text-slate-500">
            전체 <span className="font-semibold text-slate-900">{filteredBenefits.length}</span>개
          </div>
          <SortSelect value={sortBy} onChange={setSortBy} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse h-80 bg-slate-200 rounded-3xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            {error}
          </div>
        ) : filteredBenefits.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            검색 결과가 없습니다. 다른 키워드로 검색해보세요.
          </div>
        ) : (
          <BenefitList benefits={filteredBenefits} />
        )}
      </div>
    </div>
  )
}
