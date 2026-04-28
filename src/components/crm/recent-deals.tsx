import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

const deals = [
  { id: '1', title: 'Acme Corp Enterprise License', account: 'Acme Corp', value: 120000, stage: 'Negotiation', stageColor: '#fb923c', probability: 75, closeDate: new Date('2024-03-31'), owner: 'John Doe' },
  { id: '2', title: 'TechCo Pro Annual', account: 'TechCo', value: 48000, stage: 'Proposal', stageColor: '#a78bfa', probability: 50, closeDate: new Date('2024-02-28'), owner: 'Mike Chen' },
  { id: '3', title: 'Globex Starter Bundle', account: 'Globex Inc', value: 12000, stage: 'Qualified', stageColor: '#60a5fa', probability: 25, closeDate: new Date('2024-04-15'), owner: 'Lisa Park' },
  { id: '4', title: 'Initech Growth Plan', account: 'Initech', value: 36000, stage: 'Proposal', stageColor: '#a78bfa', probability: 50, closeDate: new Date('2024-03-15'), owner: 'John Doe' },
  { id: '5', title: 'Umbrella SaaS Suite', account: 'Umbrella Corp', value: 84000, stage: 'Lead', stageColor: '#94a3b8', probability: 10, closeDate: new Date('2024-05-30'), owner: 'Sarah Kim' },
]

export default function RecentDeals() {
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Deal', 'Account', 'Value', 'Stage', 'Close Date', 'Owner'].map((col) => (
                <th key={col} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deals.map((deal, i) => (
              <tr
                key={deal.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <Link href={`/dashboard/deals/${deal.id}`} className="font-medium text-sm hover:text-primary transition-colors">
                    {deal.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{deal.account}</td>
                <td className="px-6 py-4 text-sm font-semibold">{formatCurrency(deal.value)}</td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${deal.stageColor}20`, color: deal.stageColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: deal.stageColor }} />
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(deal.closeDate)}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{deal.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
