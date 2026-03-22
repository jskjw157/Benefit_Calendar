"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { StatusTabs } from "@/components/my-benefits/status-tabs"
import { BenefitList } from "@/components/benefits/benefit-list"
import { useUserBenefits } from "@/shared/hooks/use-user-benefits"
import { UserBenefitStatus } from "@/shared/types/user.types"
import { Benefit } from "@/shared/types/benefit.types"

const TAB_STATUS_MAP: Record<string, UserBenefitStatus | undefined> = {
  bookmark: "BOOKMARKED",
  preparing: "PREPARING",
  applied: "APPLIED",
  received: "RECEIVED",
}

export default function MyBenefitsPage() {
  const [activeTab, setActiveTab] = useState("bookmark")
  const status = TAB_STATUS_MAP[activeTab]
  const { userBenefits, loading, error } = useUserBenefits(status)

  const tabs = [
    { id: "bookmark", label: "찜한 혜택", count: activeTab === "bookmark" ? userBenefits.length : 0 },
    { id: "preparing", label: "준비 중", count: activeTab === "preparing" ? userBenefits.length : 0 },
    { id: "applied", label: "신청 완료", count: activeTab === "applied" ? userBenefits.length : 0 },
    { id: "received", label: "수령 완료", count: activeTab === "received" ? userBenefits.length : 0 },
  ]

  // API returns joined data (benefit fields + userBenefit status)
  const benefitsForList = userBenefits as unknown as Partial<Benefit>[]

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
           {loading ? (
             <div className="flex items-center justify-center h-64 text-slate-400">
               불러오는 중...
             </div>
           ) : error ? (
             <div className="flex items-center justify-center h-64 text-red-400">
               {error}
             </div>
           ) : userBenefits.length > 0 ? (
             <BenefitList benefits={benefitsForList} />
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
