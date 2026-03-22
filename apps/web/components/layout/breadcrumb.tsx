'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { motion } from 'framer-motion'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2"
        >
          <ChevronRight className="h-4 w-4 text-slate-300" />
          {item.href ? (
            <Link href={item.href} className="text-slate-500 hover:text-slate-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </nav>
  )
}
