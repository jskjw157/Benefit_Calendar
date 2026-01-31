"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, Share2, ExternalLink, Bookmark, CheckCircle2, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Benefit } from "@/shared/types/benefit.types"

// Mock Data (Same as benefits page for consistency)
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

const MOCK_DATA: Record<string, Partial<Benefit>> = {
  "1": {
    id: "1",
    title: "청년월세 특별지원",
    agency: "국토교통부",
    category: "주거",
    region: "전국",
    amount: "월 20만원",
    status: "OPEN",
    deadline: "2026-02-25",
    applyPeriod: { start: "2026-01-01", end: "2026-02-25" },
    applicationLink: "https://bokjiro.go.kr",
    requirements: [
      "만 19세 ~ 34세 독립 거주 무주택 청년",
      "보증금 5천만원 이하 및 월세 60만원 이하",
      "중위소득 60% 이하 (원가구 100% 이하)"
    ],
    documents: [
      "월세지원 신청서",
      "임대차계약서 사본",
      "통장 사본",
      "가족관계증명서"
    ]
  },
  // Add fallback for ID 2 for demo
  "2": {
    id: "2",
    title: "경기도 청년기본소득 1분기",
    agency: "경기도",
    category: "생활",
    region: "경기도",
    amount: "분기별 25만원",
    status: "OPEN",
    deadline: "2026-02-28",
    applyPeriod: { start: "2026-02-01", end: "2026-02-28" },
    requirements: ["경기도 내 3년 이상 거주", "만 24세 청년"],
    documents: ["주민등록초본"]
  }
}

export default function BenefitDetailPage() {
  const params = useParams()
  const id = params.benefitId as string
  const benefit = MOCK_DATA[id] || MOCK_DATA["1"] // Fallback to ID 1 if not found

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 max-w-5xl">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/benefits">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로 돌아가기
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${getCategoryClass(benefit.category || "")}`}>
                  {benefit.category}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                  {benefit.region}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-4">
                {benefit.title}
              </h1>
              <div className="flex items-center gap-2 text-lg text-slate-500">
                <Building2 className="h-5 w-5" />
                <span>{benefit.agency}</span>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-blue-50/50 border-blue-100">
                <div className="p-6">
                  <span className="text-sm font-medium text-blue-600 block mb-1">지원 금액</span>
                  <span className="text-2xl font-bold text-slate-900">{benefit.amount}</span>
                </div>
              </Card>
              <Card className="bg-orange-50/50 border-orange-100">
                <div className="p-6">
                  <span className="text-sm font-medium text-orange-600 block mb-1">신청 마감</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-slate-900">{benefit.deadline}</span>
                    <span className="text-sm font-bold text-orange-500 bg-white px-2 py-0.5 rounded-full shadow-sm">
                      D-5
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Requirements Section */}
            <section className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-slate-900">누가 신청할 수 있나요?</h2>
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
                {benefit.requirements?.map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{req}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Documents Section */}
            <section className="space-y-4 pt-4">
              <h2 className="text-xl font-bold text-slate-900">필요한 서류</h2>
              <div className="flex flex-wrap gap-2">
                {benefit.documents?.map((doc, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-slate-50 text-slate-600 font-medium border border-slate-200">
                    📄 {doc}
                  </span>
                ))}
              </div>
            </section>

            {/* Timeline Section (3D Interactive) */}
            <section className="space-y-6 pt-8">
              <h2 className="text-xl font-bold text-slate-900">신청 절차</h2>
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-transparent" />

                {/* Timeline Steps */}
                <div className="space-y-6">
                  {[
                    { step: 1, title: "온라인 신청서 작성", desc: "복지로 사이트에서 신청서 제출", status: "upcoming" },
                    { step: 2, title: "서류 제출", desc: "필요 서류 업로드 또는 방문 제출", status: "upcoming" },
                    { step: 3, title: "심사 진행", desc: "약 2주 소요 (기관별 상이)", status: "upcoming" },
                    { step: 4, title: "결과 안내", desc: "승인 시 문자 또는 이메일 수신", status: "upcoming" },
                    { step: 5, title: "혜택 수령", desc: "계좌 이체 또는 카드 발급", status: "upcoming" }
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex gap-6 group"
                    >
                      {/* Step Number Circle */}
                      <div className="relative z-10 flex-shrink-0">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50"
                        >
                          {item.step}
                        </motion.div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 pb-6">
                        <motion.div
                          whileHover={{ y: -2 }}
                          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                        >
                          <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recommended Benefits Section */}
            <section className="space-y-6 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">이런 혜택은 어때요?</h2>
                <span className="text-sm text-slate-500">혜택 조건이 비슷해요</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "rec-1", title: "중소기업 취업청년 전월세보증금 대출", category: "주거", amount: "최대 1억원" },
                  { id: "rec-2", title: "청년전세임대 지원", category: "주거", amount: "최대 7천만원" }
                ].map((rec, i) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                    }}
                  >
                    <Link href={`/benefits/${rec.id}`}>
                      <Card className="p-5 cursor-pointer border-slate-100 hover:border-blue-200 transition-all bg-gradient-to-br from-white to-blue-50/30">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                            {rec.category}
                          </span>
                          <ArrowLeft className="h-4 w-4 text-slate-400 rotate-180" />
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{rec.title}</h3>
                        <p className="text-sm font-semibold text-violet-600">{rec.amount}</p>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* FAQ Accordion (Kinetic Typography) */}
            <section className="space-y-6 pt-8">
              <h2 className="text-xl font-bold text-slate-900">자주 묻는 질문</h2>
              <div className="space-y-3">
                {[
                  {
                    q: "보증금 5천만원, 월세 65만원인데 신청 가능한가요?",
                    a: "아쉽게도 월세 60만원 이하만 신청 가능합니다. 계약서 재조정을 고려해보세요."
                  },
                  {
                    q: "부모님과 같이 살고 있는데 신청할 수 있나요?",
                    a: "독립 거주가 필수 조건입니다. 전입신고가 본인 명의로 되어 있어야 합니다."
                  },
                  {
                    q: "재신청이 가능한가요?",
                    a: "최초 12개월 지원 후, 조건 충족 시 최대 12개월 연장 가능합니다."
                  }
                ].map((faq, i) => {
                  const [isOpen, setIsOpen] = React.useState(false)

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                    >
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                      >
                        <motion.span
                          className="font-semibold text-slate-900 pr-4"
                          animate={{ x: isOpen ? 4 : 0 }}
                        >
                          Q. {faq.q}
                        </motion.span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </button>
                      <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? "auto" : 0,
                          opacity: isOpen ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 text-slate-600 bg-slate-50/50">
                          A. {faq.a}
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </motion.div>

          {/* Right Column: Floating Action Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <Card className="p-6 space-y-6 shadow-xl shadow-blue-900/5 border-blue-100/50 bg-white/80 backdrop-blur-xl">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">신청 기간</h3>
                  <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">
                      {benefit.applyPeriod?.start} ~ {benefit.applyPeriod?.end}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button size="lg" className="w-full text-lg shadow-lg shadow-blue-500/20 font-semibold h-14 rounded-2xl">
                    지금 신청하기
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                      <Bookmark className="mr-2 h-4 w-4" />
                      저장
                    </Button>
                    <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50">
                      <Share2 className="mr-2 h-4 w-4" />
                      공유
                    </Button>
                  </div>
                </div>
                
                <p className="text-xs text-center text-slate-400">
                  신청 버튼을 누르면 해당 기관 페이지로 이동합니다.
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}