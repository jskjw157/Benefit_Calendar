"use client"

import * as React from "react"
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, Share2, ExternalLink, Bookmark, CheckCircle2, Building2, Bell, Download, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Benefit } from "@/shared/types/benefit.types"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { useRef, useState, useEffect } from "react"
import { benefitService } from "@/shared/services/benefit.service"
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

function MagneticButton({ children, className, variant, size, ...props }: React.ComponentProps<typeof Button>) {
  const btnRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.3)
    y.set((e.clientY - centerY) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={btnRef}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <Button variant={variant} size={size} className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  )
}

export default function BenefitDetailPage() {
  const params = useParams()
  const id = params.benefitId as string
  const [benefit, setBenefit] = useState<Partial<Benefit>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    benefitService.getById(id)
      .then((data) => setBenefit(data))
      .catch(() => setBenefit({ id, title: '혜택을 찾을 수 없습니다', agency: '-', category: '생활', region: '-', amount: '-' }))
      .finally(() => setLoading(false))
  }, [id])

  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: loading ? undefined : timelineRef,
    offset: ["start end", "end start"]
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  const handleSetAlert = (benefitId: string) => {
    // WebSocket 알림 설정 (Mock)
    console.log('알림 설정:', benefitId)
    alert('마감 3일 전 알림이 설정되었습니다')
  }

  const handleDownloadDocuments = () => {
    // 서류 패키지 다운로드 (Mock)
    const docs = benefit.documents?.join(', ')
    console.log('다운로드:', docs)
    alert('서류 패키지를 준비하고 있습니다...')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-lg">불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />

      <div className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 max-w-5xl">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Breadcrumb items={[
            { label: '혜택 탐색', href: '/benefits' },
            { label: benefit.category || '주거', href: `/benefits?category=${benefit.category}` },
            { label: benefit.title || '청년월세 특별지원' }
          ]} />
        </motion.div>

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
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotateZ: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div style={{ transform: "translateZ(20px)" }} className="text-sm font-bold text-orange-500 bg-white px-2 py-0.5 rounded-full shadow-sm">
                        D-5
                      </div>
                    </motion.div>
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

            {/* Timeline Section (3D Interactive + Scroll-Linked) */}
            <section ref={timelineRef} className="space-y-6 pt-8">
              <h2 className="text-xl font-bold text-slate-900">신청 절차</h2>
              <div className="relative">
                {/* Animated SVG Line */}
                <svg className="absolute left-6 top-0 bottom-0 w-0.5 h-full" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 1 0 L 1 100%"
                    stroke="url(#timeline-gradient)"
                    strokeWidth="2"
                    fill="none"
                    style={{ pathLength }}
                    initial={{ pathLength: 0 }}
                  />
                </svg>

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

            {/* FAQ Accordion */}
            <section className="space-y-4 pt-8">
              <h2 className="text-xl font-bold text-slate-900">자주 묻는 질문</h2>
              <div className="space-y-3">
                {[
                  {
                    question: "기존에 다른 주거 지원을 받고 있어도 신청할 수 있나요?",
                    answer: "중복 지원 여부는 혜택 종류에 따라 다릅니다. 월세 지원의 경우 기존에 국토부 주거급여를 받고 계시다면 중복 신청이 제한될 수 있습니다. 자세한 사항은 해당 기관에 문의하시기 바랍니다."
                  },
                  {
                    question: "서류는 온라인으로 제출 가능한가요?",
                    answer: "네, 대부분의 혜택은 복지로(bokjiro.go.kr)에서 온라인으로 신청 및 서류 제출이 가능합니다. 다만 일부 혜택은 방문 신청이 필요할 수 있으니 신청 안내를 확인해주세요."
                  },
                  {
                    question: "신청 결과는 언제 확인할 수 있나요?",
                    answer: "심사 기간은 보통 신청 후 2-4주 소요되며, 결과는 신청 시 등록하신 연락처로 개별 통보됩니다. 복지로 마이페이지에서도 진행 상황을 확인하실 수 있습니다."
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
                      className="glass-card overflow-hidden"
                    >
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center"
                      >
                        <motion.span
                          animate={{ x: isOpen ? 4 : 0 }}
                          className="font-medium text-slate-900"
                        >
                          {faq.question}
                        </motion.span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                        <div className="px-6 pb-4 text-sm text-slate-600">
                          {faq.answer}
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
                  <MagneticButton size="lg" className="w-full text-lg shadow-lg shadow-blue-500/20 font-semibold h-14 rounded-2xl">
                    지금 신청하기
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </MagneticButton>

                  <MagneticButton
                    variant="outline"
                    size="lg"
                    className="w-full border-blue-200 hover:bg-blue-50 hover:text-blue-600 h-12 rounded-xl"
                    onClick={() => handleSetAlert(benefit.id || '1')}
                  >
                    <Bell className="mr-2 h-5 w-5" />
                    마감 3일 전 알림받기
                  </MagneticButton>

                  <MagneticButton
                    variant="outline"
                    size="lg"
                    className="w-full border-slate-200 hover:bg-slate-50 h-12 rounded-xl"
                    onClick={() => handleDownloadDocuments()}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    필요 서류 다운로드
                  </MagneticButton>

                  <div className="grid grid-cols-2 gap-3">
                    <MagneticButton variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                      <Bookmark className="mr-2 h-4 w-4" />
                      저장
                    </MagneticButton>
                    <MagneticButton variant="outline" className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50">
                      <Share2 className="mr-2 h-4 w-4" />
                      공유
                    </MagneticButton>
                  </div>
                </div>
                
                {/* 신청 요약 */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">신청 요약</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">지역</span>
                      <span className="font-medium text-slate-900">{benefit.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">담당 기관</span>
                      <span className="font-medium text-slate-900">{benefit.agency}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">신청 링크</span>
                      <a
                        href={benefit.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        바로가기 <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-slate-500 mb-1">문의</div>
                      <div className="font-medium text-slate-900">02-1234-5678</div>
                      <div className="text-xs text-slate-400 mt-1">평일 09:00-18:00</div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-center text-slate-400 mt-4">
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