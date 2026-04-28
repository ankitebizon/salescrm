'use client'

import { useState } from 'react'
import { Plus, MoreHorizontal, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const initialStages = [
  {
    id: 'lead', name: 'Lead', color: '#94a3b8', probability: 10,
    deals: [
      { id: 'd1', title: 'Umbrella SaaS Suite', account: 'Umbrella Corp', value: 84000, probability: 10, closeDate: new Date('2024-05-30'), owner: 'SK' },
      { id: 'd2', title: 'Wayne Industries CRM', account: 'Wayne Industries', value: 220000, probability: 10, closeDate: new Date('2024-06-15'), owner: 'JD' },
    ]
  },
  {
    id: 'qualified', name: 'Qualified', color: '#60a5fa', probability: 25,
    deals: [
      { id: 'd3', title: 'Globex Starter Bundle', account: 'Globex Inc', value: 12000, probability: 25, closeDate: new Date('2024-04-15'), owner: 'LP' },
      { id: 'd4', title: 'Vandelay Import/Export', account: 'Vandelay', value: 56000, probability: 25, closeDate: new Date('2024-04-30'), owner: 'MC' },
    ]
  },
  {
    id: 'proposal', name: 'Proposal', color: '#a78bfa', probability: 50,
    deals: [
      { id: 'd5', title: 'TechCo Pro Annual', account: 'TechCo', value: 48000, probability: 50, closeDate: new Date('2024-02-28'), owner: 'MC' },
      { id: 'd6', title: 'Initech Growth Plan', account: 'Initech', value: 36000, probability: 50, closeDate: new Date('2024-03-15'), owner: 'JD' },
      { id: 'd7', title: 'Oceanic Airlines Fleet', account: 'Oceanic', value: 180000, probability: 60, closeDate: new Date('2024-03-20'), owner: 'SK' },
    ]
  },
  {
    id: 'negotiation', name: 'Negotiation', color: '#fb923c', probability: 75,
    deals: [
      { id: 'd8', title: 'Acme Corp Enterprise', account: 'Acme Corp', value: 120000, probability: 75, closeDate: new Date('2024-03-31'), owner: 'JD' },
    ]
  },
  {
    id: 'won', name: 'Closed Won', color: '#34d399', probability: 100,
    deals: [
      { id: 'd9', title: 'Dharma Initiative SaaS', account: 'Dharma Inc', value: 64000, probability: 100, closeDate: new Date('2024-01-31'), owner: 'LP' },
    ]
  },
]

function DealCard({ deal, stageColor }: { deal: any; stageColor: string }) {
  return (
    <Link href={`/dashboard/deals/${deal.id}`}>
      <div className="bg-card border border-border rounded-lg p-3.5 cursor-pointer deal-card-shadow group">
        <div className="flex items-start justify-between gap-2 mb-3">
          <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {deal.title}
          </p>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mb-3">{deal.account}</p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold">{formatCurrency(deal.value)}</span>
          <div className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: stageColor }}
            />
            <span className="text-xs text-muted-foreground">{deal.probability}%</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{formatDate(deal.closeDate)}</span>
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">{deal.owner}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function PipelineBoard() {
  const [stages, setStages] = useState(initialStages)

  const totalValue = stages.flatMap(s => s.deals).reduce((sum, d) => sum + d.value, 0)
  const totalDeals = stages.flatMap(s => s.deals).length

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Pipeline summary bar */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Total pipeline:</span>
          <span className="font-bold">{formatCurrency(totalValue)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalDeals}</span> open deals
        </div>

        {/* Stage progress dots */}
        <div className="flex items-center gap-2 ml-auto">
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
              <span>{stage.deals.length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4 pipeline-scroll flex-1 min-h-0">
        {stages.map((stage) => {
          const stageValue = stage.deals.reduce((sum, d) => sum + d.value, 0)
          return (
            <div
              key={stage.id}
              className="flex flex-col shrink-0 w-72 bg-muted/40 rounded-xl border border-border overflow-hidden"
            >
              {/* Column header */}
              <div className="px-4 py-3 border-b border-border flex items-center gap-2 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stage.color }} />
                <span className="font-semibold text-sm">{stage.name}</span>
                <span className="text-xs text-muted-foreground bg-background border border-border rounded-full px-2 py-0.5 ml-1">
                  {stage.deals.length}
                </span>
                <div className="ml-auto text-xs font-medium text-muted-foreground">
                  {formatCurrency(stageValue)}
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[200px]">
                {stage.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} stageColor={stage.color} />
                ))}
              </div>

              {/* Add deal */}
              <div className="p-3 shrink-0 border-t border-border">
                <button className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-lg hover:bg-accent">
                  <Plus className="w-4 h-4" />
                  Add deal
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
