import { TrendingUp, DollarSign, Target, Percent } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

// In production these come from the DB via server action
const stats = [
  {
    label: 'Total Pipeline',
    value: formatCurrency(1240000),
    change: '+12.5%',
    positive: true,
    icon: DollarSign,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Deals Won (MTD)',
    value: formatCurrency(340000),
    change: '+8.2%',
    positive: true,
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Open Deals',
    value: '47',
    change: '+3',
    positive: true,
    icon: Target,
    color: 'bg-violet-50 text-violet-600',
  },
  {
    label: 'Win Rate',
    value: '34%',
    change: '-2.1%',
    positive: false,
    icon: Percent,
    color: 'bg-amber-50 text-amber-600',
  },
]

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="bg-card rounded-xl border border-border p-5 space-y-3 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', stat.color)}>
              <stat.icon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className={cn('text-xs mt-1 font-medium', stat.positive ? 'text-emerald-600' : 'text-rose-500')}>
              {stat.change} vs last month
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
