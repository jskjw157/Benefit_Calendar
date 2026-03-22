import dynamic from "next/dynamic"

const BentoGridDashboard = dynamic(
  () => import("@/components/dashboard/bento-grid").then(mod => ({ default: mod.BentoGridDashboard })),
  {
    loading: () => (
      <div className="container mx-auto p-8 max-w-7xl">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="grid grid-cols-3 gap-6">
            <div className="h-48 bg-slate-200 rounded-3xl col-span-2" />
            <div className="h-48 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    ),
    ssr: true
  }
)

export default function HomePage() {
  return <BentoGridDashboard />
}