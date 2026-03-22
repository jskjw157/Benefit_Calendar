"use client"

import { motion } from "framer-motion"
import { SpotlightCard } from "@/components/design-lab/spotlight-card"
import { InteractiveTimeline } from "@/components/design-lab/interactive-timeline"
import { ArrowUpRight, Sparkles, Zap, ShieldCheck } from "lucide-react"

export default function DesignLabPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 md:p-20 relative overflow-hidden font-sans">
      {/* 1. Global Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] noise z-50"></div>
      
      {/* 2. Abstract Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-400/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto space-y-32">
        
        {/* SECTION 1: HYPER TYPOGRAPHY HERO */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-8">
               <div className="h-px w-12 bg-slate-300"></div>
               <span className="text-sm font-black tracking-[0.2em] text-blue-600 uppercase">Design Lab v2.0</span>
            </div>
            
            <h1 className="text-[clamp(4rem,15vw,10rem)] font-black leading-[0.85] tracking-[-0.05em] text-slate-900 mb-12">
              Bolder.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 animate-gradient-x bg-[length:200%_auto]">
                Smarter.
              </span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
               <p className="text-2xl md:text-3xl font-medium text-slate-500 leading-[1.4] tracking-tight">
                우리는 복잡한 정부 정책을 <span className="text-slate-900 font-bold">하나의 선명한 흐름</span>으로 바꿉니다. 
                더 크고, 더 직관적이며, 더 아름답게.
               </p>
               <div className="flex gap-4">
                  <div className="flex flex-col">
                     <span className="text-5xl font-black text-slate-900">50k+</span>
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Users</span>
                  </div>
                  <div className="h-12 w-px bg-slate-200 mx-4"></div>
                  <div className="flex flex-col">
                     <span className="text-5xl font-black text-slate-900">98%</span>
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Satisfaction</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: INTERACTIVE PROCESS (TIMELINE) */}
        <section className="space-y-12">
          <div className="flex items-end justify-between">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900">
              신청 프로세스
            </h2>
            <p className="text-slate-500 font-medium mb-1">복잡한 절차를 4단계로 압축했습니다.</p>
          </div>
          <InteractiveTimeline />
        </section>

        {/* SECTION 3: FEATURE HIGHLIGHTS (SPOTLIGHT CARDS) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <SpotlightCard className="h-[450px] group border-blue-100/50" spotlightColor="rgba(59, 130, 246, 0.25)">
            <div className="p-10 h-full flex flex-col">
              <div className="p-4 bg-blue-50 w-fit rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">초고속 매칭</h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-auto">
                AI가 당신의 프로필을 분석하여 0.1초 만에 가장 적합한 혜택 5가지를 추천합니다.
              </p>
              <div className="pt-8 flex items-center justify-between">
                 <span className="text-4xl font-black text-blue-600">0.1s</span>
                 <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                    <ArrowUpRight className="h-6 w-6" />
                 </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="h-[450px] group border-orange-100/50" spotlightColor="rgba(249, 115, 22, 0.25)">
            <div className="p-10 h-full flex flex-col">
              <div className="p-4 bg-orange-50 w-fit rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">스마트 알림</h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-auto">
                마감 3일 전, 잊지 않도록 당신이 선호하는 채널로 강력한 알람을 보내드립니다.
              </p>
              <div className="pt-8 flex items-center justify-between">
                 <span className="text-4xl font-black text-orange-600">D-3</span>
                 <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                    <ArrowUpRight className="h-6 w-6" />
                 </div>
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard className="h-[450px] group border-emerald-100/50" spotlightColor="rgba(16, 185, 129, 0.25)">
            <div className="p-10 h-full flex flex-col">
              <div className="p-4 bg-emerald-50 w-fit rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">안전한 데이터</h3>
              <p className="text-lg text-slate-500 leading-relaxed mb-auto">
                당신의 소중한 개인정보는 금융권 수준의 보안 기술로 철저하게 보호됩니다.
              </p>
              <div className="pt-8 flex items-center justify-between">
                 <span className="text-4xl font-black text-emerald-600">AES</span>
                 <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                    <ArrowUpRight className="h-6 w-6" />
                 </div>
              </div>
            </div>
          </SpotlightCard>

        </section>

        {/* FOOTER MOCKUP */}
        <footer className="pt-20 pb-10 border-t border-slate-200 text-center">
           <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs">
              Benefit Calendar Design Lab © 2026
           </p>
        </footer>

      </div>
    </div>
  )
}