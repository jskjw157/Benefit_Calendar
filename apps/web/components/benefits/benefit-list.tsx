"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Building2, ArrowRight } from "lucide-react"
import { Benefit } from "@/shared/types/benefit.types"
import { Button } from "@/components/ui/button"

interface BenefitListProps {
  benefits: Partial<Benefit>[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const getCategoryClass = (category: string) => {
  const map: Record<string, string> = {
    "주거": "category-housing",
    "생활": "category-living",
    "교통": "category-transport",
    "교육": "category-education",
    "창업": "category-startup",
    "의료": "category-medical",
    "문화": "category-culture"
  }
  return map[category] || "bg-blue-50 text-blue-700 ring-blue-700/10"
}

export function BenefitList({ benefits }: BenefitListProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {benefits.map((benefit) => (
        <motion.div key={benefit.id} variants={item}>
          <div className="group relative h-full bg-white/60 backdrop-blur-lg border border-white/40 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:bg-white/80 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            {/* Gradient Blob on Hover */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${getCategoryClass(benefit.category || "")}`}>
                  {benefit.category}
                </span>
                {benefit.status === 'OPEN' ? (
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                    D-5
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                    마감
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {benefit.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                <Building2 className="h-4 w-4" />
                <span>{benefit.agency}</span>
                <span className="text-slate-300">|</span>
                <span>{benefit.region}</span>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-medium">지원금액</span>
                  <span className="text-lg font-bold text-slate-900">{benefit.amount}</span>
                </div>
                <Link href={`/benefits/${benefit.id}`}>
                  <Button size="icon" variant="glass" className="rounded-full h-10 w-10 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
