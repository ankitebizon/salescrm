'use client'

import { TrendingUp, DollarSign, Target, Percent } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { useDashboardStats } from '@/hooks/use-crm'

const icons = [DollarSign, TrendingUp, Target, Percent]
const colors = [
  'bg-blue-50 text-blue-600',
  'bg-emerald-50 text-emerald-600',
  'bg-violet-50 text-violet-600',
  'bg-amber-50 text-amber-600',
]

function StatCard({ label, value, icon: Icon, color, i }: {
  label: string; value: string; icon: any; color: string; i: number
}) {
  return (
    <div
      className="bg-card rounded-xl border border-border p-5 space-y-3 animate-fade-in"
      style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', color)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  )
}

function SkeletonCard({ i }: { i: number }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-muted rounded" />
        <div className="w-8 h-8 bg-muted rounded-lg" />
      </div>
      <div className="h-8 w-24 bg-muted rounded" />
    </div>
  )
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => <SkeletonCard key={i} i={i} />)}
      </div>
    )
  }

  const cards = [
    { label: 'Total Pipeline', value: formatCurrency(stats.openValue ?? 0) },
    { label: 'Won This Month', value: formatCurrency(stats.wonValue ?? 0) },
    { label: 'Open Deals', value: String(stats.openDeals ?? 0) },
    { label: 'Win Rate', value: `${stats.conversionRate ?? 0}%` },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, i) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={icons[i]}
          color={colors[i]}
          i={i}
        />
      ))}
    </div>
  )
}
