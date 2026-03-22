"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle } from "lucide-react"

const steps = [
  { id: "01", title: "자격 확인", description: "나이, 지역, 소득 요건을 자동으로 체크합니다." },
  { id: "02", title: "서류 준비", description: "주민등록초본, 통장 사본 등 필요 서류를 안내합니다." },
  { id: "03", title: "온라인 신청", description: "복지로 또는 관할 지자체 사이트로 연결됩니다." },
  { id: "04", title: "심사 및 수령", description: "최종 심사 후 지원금이 지급됩니다." },
]

export function InteractiveTimeline() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
      {/* Connecting Line (Desktop) */}
      <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-10" />
      
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 }}
          className="relative group"
        >
          <div className="p-6 rounded-3xl bg-white/40 border border-white/40 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
            <div className="flex items-center justify-between mb-4">
               <span className="text-4xl font-black text-slate-200 group-hover:text-blue-500/20 transition-colors duration-500">
                {step.id}
              </span>
              {index === 0 ? (
                <CheckCircle2 className="text-blue-500 h-6 w-6" />
              ) : (
                <Circle className="text-slate-300 h-6 w-6 group-hover:text-blue-400 transition-colors" />
              )}
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
