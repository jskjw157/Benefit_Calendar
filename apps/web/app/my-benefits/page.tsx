"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { StatusTabs } from "@/components/my-benefits/status-tabs"
import { BenefitList } from "@/components/benefits/benefit-list"
import { Benefit } from "@/shared/types/benefit.types"

// Mock Data for My Benefits
const MY_BENEFITS: Partial<Benefit>[] = [
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
    id: "3",
    title: "국민내일배움카드",
    agency: "고용노동부",
    category: "교육",
    region: "전국",
    amount: "최대 500만원",
    status: "OPEN",
    deadline: "상시"
  }
]

export default function MyBenefitsPage() {
  const [activeTab, setActiveTab] = useState("bookmark")

  const tabs = [
    { id: "bookmark", label: "찜한 혜택", count: 2 },
    { id: "preparing", label: "준비 중", count: 1 },
    { id: "applied", label: "신청 완료", count: 5 },
    { id: "received", label: "수령 완료", count: 0 },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">내 혜택</h1>
            <p className="text-lg text-slate-500">관심 있거나 신청한 혜택을 모아보세요.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <StatusTabs 
              tabs={tabs} 
              activeTab={activeTab} 
              onChange={setActiveTab} 
            />
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
           {activeTab === "bookmark" ? (
             <BenefitList benefits={MY_BENEFITS} />
           ) : (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl"
             >
               <p>아직 {tabs.find(t => t.id === activeTab)?.label} 목록이 없습니다.</p>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  )
}
