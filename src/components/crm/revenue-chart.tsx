'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const data = [
  { month: 'Jan', revenue: 65000, target: 80000 },
  { month: 'Feb', revenue: 72000, target: 80000 },
  { month: 'Mar', revenue: 88000, target: 85000 },
  { month: 'Apr', revenue: 75000, target: 85000 },
  { month: 'May', revenue: 92000, target: 90000 },
  { month: 'Jun', revenue: 105000, target: 90000 },
  { month: 'Jul', revenue: 98000, target: 95000 },
  { month: 'Aug', revenue: 112000, target: 100000 },
  { month: 'Sep', revenue: 124000, target: 110000 },
  { month: 'Oct', revenue: 118000, target: 115000 },
  { month: 'Nov', revenue: 135000, target: 120000 },
  { month: 'Dec', revenue: 142000, target: 125000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground capitalize">{entry.name}:</span>
            <span className="font-medium">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export default function RevenueChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-semibold text-base">Revenue vs Target</h2>
          <p className="text-muted-foreground text-sm">Monthly performance this year</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-primary rounded" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-muted-foreground/40 rounded border-dashed border-t" />
            Target
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(230,100%,60%)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="hsl(230,100%,60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="target"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#revGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
