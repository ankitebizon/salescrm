'use client'

import { useState } from 'react'
import { Search, Plus, Globe, Users, DollarSign, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

const accounts = [
  { id: '1', name: 'Acme Corp', website: 'acmecorp.com', industry: 'Technology', size: 'ENTERPRISE', annualRevenue: 50000000, contactCount: 8, dealCount: 3, totalValue: 340000 },
  { id: '2', name: 'TechCo', website: 'techco.io', industry: 'SaaS', size: 'MEDIUM', annualRevenue: 12000000, contactCount: 4, dealCount: 2, totalValue: 84000 },
  { id: '3', name: 'Globex Inc', website: 'globex.com', industry: 'Manufacturing', size: 'LARGE', annualRevenue: 80000000, contactCount: 6, dealCount: 1, totalValue: 12000 },
  { id: '4', name: 'Initech', website: 'initech.com', industry: 'Finance', size: 'MEDIUM', annualRevenue: 25000000, contactCount: 3, dealCount: 2, totalValue: 92000 },
  { id: '5', name: 'Umbrella Corp', website: 'umbrella.com', industry: 'Healthcare', size: 'ENTERPRISE', annualRevenue: 200000000, contactCount: 12, dealCount: 1, totalValue: 84000 },
  { id: '6', name: 'Dharma Inc', website: 'dharma.co', industry: 'Research', size: 'SMALL', annualRevenue: 5000000, contactCount: 2, dealCount: 1, totalValue: 64000 },
  { id: '7', name: 'Wayne Industries', website: 'wayne.com', industry: 'Conglomerate', size: 'ENTERPRISE', annualRevenue: 500000000, contactCount: 5, dealCount: 1, totalValue: 220000 },
  { id: '8', name: 'Vandelay', website: 'vandelay.com', industry: 'Retail', size: 'SMALL', annualRevenue: 8000000, contactCount: 2, dealCount: 1, totalValue: 56000 },
]

const sizeColors: Record<string, string> = {
  STARTUP: 'bg-slate-100 text-slate-600',
  SMALL: 'bg-blue-100 text-blue-600',
  MEDIUM: 'bg-violet-100 text-violet-600',
  LARGE: 'bg-amber-100 text-amber-600',
  ENTERPRISE: 'bg-emerald-100 text-emerald-600',
}

const industryColors: Record<string, string> = {
  Technology: '#6366f1', SaaS: '#8b5cf6', Manufacturing: '#f59e0b',
  Finance: '#10b981', Healthcare: '#3b82f6', Research: '#ec4899',
  Conglomerate: '#14b8a6', Retail: '#f97316',
}

export default function AccountsGrid() {
  const [search, setSearch] = useState('')

  const filtered = accounts.filter((a) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.industry.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search accounts..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button size="sm" className="gap-2 ml-auto">
          <Plus className="w-4 h-4" /> Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((account) => {
          const color = industryColors[account.industry] || '#6366f1'
          return (
            <div key={account.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all cursor-pointer group deal-card-shadow">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: `${color}20`, color }}
                >
                  {account.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{account.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Globe className="w-3 h-3 text-muted-foreground/60" />
                    <span className="text-xs text-muted-foreground">{account.website}</span>
                  </div>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium ml-auto shrink-0', sizeColors[account.size ?? 'SMALL'])}>
                  {account.size}
                </span>
              </div>

              {/* Industry */}
              <div className="flex items-center gap-1.5 mb-4">
                <Building2 className="w-3.5 h-3.5" style={{ color }} />
                <span className="text-xs font-medium" style={{ color }}>{account.industry}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Pipeline</p>
                  <p className="text-sm font-bold">{formatCurrency(account.totalValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Contacts</p>
                  <p className="text-sm font-bold">{account.contactCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Deals</p>
                  <p className="text-sm font-bold">{account.dealCount}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
