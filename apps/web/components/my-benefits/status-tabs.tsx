"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/shared/lib/utils"

interface StatusTabsProps {
  tabs: { id: string; label: string; count: number }[]
  activeTab: string
  onChange: (id: string) => void
}

export function StatusTabs({ tabs, activeTab, onChange }: StatusTabsProps) {
  return (
    <div className="flex p-1 bg-slate-100/50 backdrop-blur-md rounded-2xl md:inline-flex w-full md:w-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl transition-colors duration-200 z-10",
            activeTab === tab.id ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="status-tab"
              className="absolute inset-0 bg-white shadow-sm border border-slate-200/50 rounded-xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span>{tab.label}</span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs",
            activeTab === tab.id ? "bg-slate-100 text-slate-900" : "bg-slate-200/50 text-slate-500"
          )}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}
