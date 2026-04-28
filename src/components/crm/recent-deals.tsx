'use client'

import Link from 'next/link'
import { ArrowRight, Loader2 } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useDeals } from '@/hooks/use-crm'

export default function RecentDeals() {
  const { data: deals = [], isLoading } = useDeals()
  const dealsArr = Array.isArray(deals) ? deals.slice(0, 5) : []

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="font-semibold text-base">Recent Deals</h2>
          <p className="text-muted-foreground text-sm">Latest opportunities in your pipeline</p>
        </div>
        <Link href="/dashboard/deals" className="text-sm text-primary hover:underline flex items-center gap-1">
          View pipeline <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
        </div>
      ) : dealsArr.length === 0 ? (
        <div className="text-center py-10 text-sm text-muted-foreground">No deals yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Deal', 'Account', 'Value', 'Stage', 'Close Date', 'Owner'].map(col => (
                  <th key={col} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dealsArr.map((deal: any) => (
                <tr key={deal.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/dashboard/deals/${deal.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                      {deal.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{deal.account?.name ?? '—'}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(deal.value)}</td>
                  <td className="px-6 py-4">
                    {deal.stage ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: `${deal.stage.color}20`, color: deal.stage.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: deal.stage.color }} />
                        {deal.stage.name}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {deal.closeDate ? formatDate(deal.closeDate) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{deal.owner?.name ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
