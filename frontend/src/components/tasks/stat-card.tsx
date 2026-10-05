'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'zinc'
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
}

const colorStyles = {
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  zinc: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

export function StatCard({ icon: Icon, label, value, color = 'zinc', trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/50 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-400">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-zinc-100">{value}</p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.isPositive ? 'text-emerald-500' : 'text-rose-500'
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}% {trend.label}
              </span>
            )}
          </div>
        </div>
        <div className={cn('rounded-lg border p-3', colorStyles[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}
