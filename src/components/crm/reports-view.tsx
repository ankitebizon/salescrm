'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  FunnelChart, Funnel, LabelList
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

const monthlyWon = [
  { month: 'Aug', value: 98000 },
  { month: 'Sep', value: 124000 },
  { month: 'Oct', value: 118000 },
  { month: 'Nov', value: 135000 },
  { month: 'Dec', value: 142000 },
  { month: 'Jan', value: 156000 },
]

const byStage = [
  { name: 'Lead', value: 304000, color: '#94a3b8', deals: 5 },
  { name: 'Qualified', value: 256000, color: '#60a5fa', deals: 4 },
  { name: 'Proposal', value: 398000, color: '#a78bfa', deals: 6 },
  { name: 'Negotiation', value: 120000, color: '#fb923c', deals: 1 },
  { name: 'Won', value: 64000, color: '#34d399', deals: 1 },
]

const byRep = [
  { name: 'John Doe', won: 204000, lost: 45000 },
  { name: 'Mike Chen', won: 156000, lost: 32000 },
  { name: 'Lisa Park', won: 128000, lost: 67000 },
  { name: 'Sarah Kim', won: 98000, lost: 28000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex gap-2">
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium">{typeof entry.value === 'number' && entry.value > 1000 ? formatCurrency(entry.value) : entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ReportsView() {
  const totalWon = byStage.find(s => s.name === 'Won')?.value || 0
  const totalPipeline = byStage.reduce((s, b) => s + b.value, 0)
  const winRate = Math.round((totalWon / totalPipeline) * 100)

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Value', value: formatCurrency(totalPipeline) },
          { label: 'Revenue Won (YTD)', value: formatCurrency(756000) },
          { label: 'Avg Deal Size', value: formatCurrency(72000) },
          { label: 'Win Rate', value: `${winRate}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Won Revenue by Month */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Won Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyWon} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline by stage */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Pipeline by Stage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={byStage} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {byStage.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Legend
                formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rep performance */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Rep Performance</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byRep} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="won" name="Won" fill="#34d399" radius={[0, 4, 4, 0]} stackId="a" />
            <Bar dataKey="lost" name="Lost" fill="#f87171" radius={[0, 4, 4, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
