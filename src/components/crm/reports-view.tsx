'use client'

import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex gap-2">
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium">
            {typeof entry.value === 'number' && entry.value > 1000
              ? formatCurrency(entry.value)
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function useReportsStats() {
  return useQuery({
    queryKey: ['reports-stats'],
    queryFn: () => fetch('/api/reports/stats').then(r => r.json()),
    staleTime: 2 * 60 * 1000,
  })
}

export default function ReportsView() {
  const { data, isLoading } = useReportsStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading reports...
      </div>
    )
  }

  const monthlyWon: any[] = data?.monthlyWon || []
  const byStage: any[] = data?.byStage || []
  const byRep: any[] = data?.byRep || []
  const summary = data?.summary || { totalPipeline: 0, wonYTD: 0, avgDealSize: 0, winRate: 0 }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pipeline Value', value: formatCurrency(summary.totalPipeline) },
          { label: 'Revenue Won (YTD)', value: formatCurrency(summary.wonYTD) },
          { label: 'Avg Deal Size', value: formatCurrency(summary.avgDealSize) },
          { label: 'Win Rate', value: `${summary.winRate}%` },
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
          {monthlyWon.every(m => m.value === 0) ? (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No won deals in the last 6 months
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyWon} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `$${v / 1000}k`}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pipeline by Stage */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Pipeline by Stage</h3>
          {byStage.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No open deals
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byStage}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byStage.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Rep Performance */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Rep Performance</h3>
        {byRep.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
            No closed deals yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, byRep.length * 52)}>
            <BarChart data={byRep} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(v) => `$${v / 1000}k`}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="won" name="Won" fill="#34d399" radius={[0, 4, 4, 0]} stackId="a" />
              <Bar dataKey="lost" name="Lost" fill="#f87171" radius={[0, 4, 4, 0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
