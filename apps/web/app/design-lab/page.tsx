"use client"

import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/design-lab/spotlight-card"
import { ArrowUpRight } from "lucide-react"

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-20 relative overflow-hidden">
      {/* Background Noise for texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
      
      {/* 1. Big Typography Section */}
      <section className="mb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-[5rem] md:text-[8rem] font-black leading-[0.9] tracking-tighter text-slate-900 mb-6">
            BENEFIT
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 animate-gradient-x bg-[length:200%_auto]">
              CALENDAR
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-slate-500 max-w-2xl leading-relaxed">
            청년을 위한 지원금, <span className="text-slate-900 font-bold decoration-blue-500/30 underline decoration-4 underline-offset-4">월 20만원</span>부터 시작하세요.
            <br />
            놓치면 사라지는 혜택을 잡아드립니다.
          </p>
        </motion.div>
      </section>

      {/* 2. Interactive Spotlight Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Card 1: Amount Highlight */}
        <SpotlightCard className="h-80 group cursor-pointer" spotlightColor="rgba(59, 130, 246, 0.2)">
          <div className="p-8 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                Support
              </span>
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                청년월세 특별지원
              </h3>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">최대 지원금</p>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">240</span>
                <span className="text-2xl font-bold text-slate-400">만원/년</span>
              </div>
            </div>
            <ArrowUpRight className="absolute top-8 right-8 text-slate-300 group-hover:text-blue-500 group-hover:rotate-45 transition-all duration-300 transform" />
          </div>
        </SpotlightCard>

        {/* Card 2: D-Day Highlight */}
        <SpotlightCard className="h-80 group cursor-pointer" spotlightColor="rgba(249, 115, 22, 0.2)">
          <div className="p-8 h-full flex flex-col justify-between">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                Deadline
              </span>
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                청년희망적금
              </h3>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1 font-medium">마감까지</p>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">D-2</span>
              </div>
              <p className="text-sm text-orange-500 mt-2 font-medium">서두르세요! 곧 마감됩니다.</p>
            </div>
             <ArrowUpRight className="absolute top-8 right-8 text-slate-300 group-hover:text-orange-500 group-hover:rotate-45 transition-all duration-300 transform" />
          </div>
        </SpotlightCard>

         {/* Card 3: New Feature */}
         <SpotlightCard className="h-80 group cursor-pointer" spotlightColor="rgba(139, 92, 246, 0.2)">
          <div className="p-8 h-full flex flex-col justify-between">
             <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider">
                New
              </span>
              <h3 className="text-2xl font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                K-패스
              </h3>
            </div>
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <p className="text-4xl font-black text-slate-900 tracking-tight">53%</p>
                  <p className="text-sm text-slate-500 font-medium">교통비 환급</p>
               </div>
            </div>
             <ArrowUpRight className="absolute top-8 right-8 text-slate-300 group-hover:text-violet-500 group-hover:rotate-45 transition-all duration-300 transform" />
          </div>
        </SpotlightCard>

      </section>
    </div>
  )
}
