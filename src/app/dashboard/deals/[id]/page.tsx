import { Metadata } from 'next'
import { ArrowLeft, Edit, Trash2, Phone, Mail, Calendar, DollarSign, TrendingUp, User, Building2 } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Deal Detail' }

// Mock data – replace with DB fetch using params.id
const deal = {
  id: '1',
  title: 'Acme Corp Enterprise License',
  value: 120000,
  currency: 'USD',
  status: 'OPEN',
  probability: 75,
  closeDate: new Date('2024-03-31'),
  description: 'Enterprise license for Acme Corp covering 500 seats. The deal includes onboarding support, dedicated CSM, and SLA guarantees.',
  stage: { name: 'Negotiation', color: '#fb923c' },
  owner: { name: 'John Doe', email: 'john@salescrm.io' },
  account: { id: '1', name: 'Acme Corp', website: 'acmecorp.com', industry: 'Technology' },
  contacts: [
    { id: 'c1', firstName: 'Sarah', lastName: 'Johnson', title: 'VP Engineering', email: 'sarah@acmecorp.com' },
    { id: 'c2', firstName: 'Rob', lastName: 'Martinez', title: 'Procurement Lead', email: 'rob@acmecorp.com' },
  ],
  activities: [
    { id: 'a1', type: 'CALL', title: 'Discovery call – discussed budget', createdAt: new Date(Date.now() - 86400000 * 3), user: { name: 'John Doe' } },
    { id: 'a2', type: 'EMAIL', title: 'Sent enterprise proposal deck', createdAt: new Date(Date.now() - 86400000 * 1), user: { name: 'John Doe' } },
    { id: 'a3', type: 'MEETING', title: 'Security review with IT team', createdAt: new Date(Date.now() - 3600000 * 5), user: { name: 'Mike Chen' } },
  ],
}

const activityIcons: Record<string, string> = {
  CALL: '📞', EMAIL: '✉️', MEETING: '🤝', NOTE: '📝', TASK: '✅',
}

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const wonValue = deal.value * (deal.probability / 100)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/deals" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to pipeline
        </Link>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/5 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Deal header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{deal.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: `${deal.stage.color}20`, color: deal.stage.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: deal.stage.color }} />
                {deal.stage.name}
              </span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{deal.probability}% probability</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold">{formatCurrency(deal.value)}</p>
            <p className="text-sm text-muted-foreground mt-1">Weighted: {formatCurrency(wonValue)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          {[
            { icon: Calendar, label: 'Close Date', value: formatDate(deal.closeDate) },
            { icon: User, label: 'Owner', value: deal.owner.name },
            { icon: Building2, label: 'Account', value: deal.account.name },
            { icon: TrendingUp, label: 'Status', value: deal.status },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex items-center gap-1.5 mb-1">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        {deal.description && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">{deal.description}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Contacts ({deal.contacts.length})</h2>
          <div className="space-y-3">
            {deal.contacts.map((contact) => (
              <div key={contact.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {contact.firstName[0]}{contact.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{contact.firstName} {contact.lastName}</p>
                  <p className="text-xs text-muted-foreground">{contact.title}</p>
                  <p className="text-xs text-primary mt-0.5">{contact.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-semibold text-sm mb-4">Account</h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
              {deal.account.name[0]}
            </div>
            <div>
              <p className="font-medium text-sm">{deal.account.name}</p>
              <p className="text-xs text-muted-foreground">{deal.account.industry}</p>
            </div>
          </div>
          <p className="text-xs text-primary">{deal.account.website}</p>
        </div>

        {/* Activity timeline */}
        <div className="bg-card border border-border rounded-xl p-5 lg:col-span-1">
          <h2 className="font-semibold text-sm mb-4">Activity</h2>
          <div className="space-y-4">
            {deal.activities.map((activity, i) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="text-base">{activityIcons[activity.type]}</span>
                  {i < deal.activities.length - 1 && (
                    <div className="w-px flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-4 min-w-0">
                  <p className="text-sm font-medium leading-snug">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.user.name} · {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-2 text-xs text-primary hover:underline">+ Log activity</button>
        </div>
      </div>
    </div>
  )
}
