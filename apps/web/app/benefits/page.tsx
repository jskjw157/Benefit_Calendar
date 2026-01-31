"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { SearchBar, FilterChip } from "@/components/benefits/search-filters"
import { BenefitList } from "@/components/benefits/benefit-list"
import { Benefit } from "@/shared/types/benefit.types"

// Sample Data (To be replaced with API)
const MOCK_BENEFITS: Partial<Benefit>[] = [
  {
    id: "1",
    title: "청년월세 특별지원",
    agency: "국토교통부",
    category: "주거",
    region: "전국",
    amount: "월 20만원",
    status: "OPEN",
    deadline: "2026-02-25"
  },
  {
    id: "2",
    title: "경기도 청년기본소득 1분기",
    agency: "경기도",
    category: "생활",
    region: "경기도",
    amount: "분기별 25만원",
    status: "OPEN",
    deadline: "2026-02-28"
  },
  {
    id: "3",
    title: "국민내일배움카드",
    agency: "고용노동부",
    category: "교육",
    region: "전국",
    amount: "최대 500만원",
    status: "OPEN",
    deadline: "상시"
  },
  {
    id: "4",
    title: "청년희망적금",
    agency: "서민금융진흥원",
    category: "생활",
    region: "전국",
    amount: "최대 1200만원",
    status: "CLOSED",
    deadline: "2026-01-31"
  },
  {
    id: "5",
    title: "중소기업 취업청년 전월세보증금 대출",
    agency: "주택도시기금",
    category: "주거",
    region: "전국",
    amount: "최대 1억원",
    status: "OPEN",
    deadline: "2026-12-31"
  },
  {
    id: "6",
    title: "K-패스 (대중교통비 환급)",
    agency: "국토교통부",
    category: "교통",
    region: "전국",
    amount: "최대 53% 환급",
    status: "OPEN",
    deadline: "상시"
  }
]

const CATEGORIES = ["전체", "주거", "생활", "교통", "교육", "창업", "의료"]

export default function BenefitsPage() {
  const [activeCategory, setActiveCategory] = useState("전체")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBenefits = MOCK_BENEFITS.filter(benefit => {
    const matchesCategory = activeCategory === "전체" || benefit.category === activeCategory
    const matchesSearch = !searchQuery || benefit.title?.includes(searchQuery) || benefit.agency?.includes(searchQuery)
    return matchesCategory && matchesSearch
  })

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
        <div className="flex flex-wrap gap-2 justify-center mb-10">
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

        <BenefitList benefits={filteredBenefits} />
        
        {filteredBenefits.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            검색 결과가 없습니다. 다른 키워드로 검색해보세요.
          </div>
        )}
      </div>
    </div>
  )
}
