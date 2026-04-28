'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Mail, Phone, MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials, formatRelative } from '@/lib/utils'
import { cn } from '@/lib/utils'

const contacts = [
  { id: '1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@acmecorp.com', phone: '+1 555-0101', title: 'VP of Engineering', account: 'Acme Corp', status: 'CUSTOMER', createdAt: new Date(Date.now() - 86400000 * 5) },
  { id: '2', firstName: 'Marcus', lastName: 'Chen', email: 'mchen@techco.io', phone: '+1 555-0102', title: 'CTO', account: 'TechCo', status: 'PROSPECT', createdAt: new Date(Date.now() - 86400000 * 12) },
  { id: '3', firstName: 'Emily', lastName: 'Rivera', email: 'emily@globex.com', phone: '+1 555-0103', title: 'Director of IT', account: 'Globex Inc', status: 'LEAD', createdAt: new Date(Date.now() - 86400000 * 3) },
  { id: '4', firstName: 'David', lastName: 'Park', email: 'dpark@initech.com', phone: '+1 555-0104', title: 'CEO', account: 'Initech', status: 'PROSPECT', createdAt: new Date(Date.now() - 86400000 * 20) },
  { id: '5', firstName: 'Rachel', lastName: 'Kim', email: 'rkim@umbrella.com', phone: '+1 555-0105', title: 'Procurement Manager', account: 'Umbrella Corp', status: 'LEAD', createdAt: new Date(Date.now() - 86400000 * 7) },
  { id: '6', firstName: 'Tom', lastName: 'Wilson', email: 'tom@dharma.co', phone: '+1 555-0106', title: 'Head of Operations', account: 'Dharma Inc', status: 'CUSTOMER', createdAt: new Date(Date.now() - 86400000 * 45) },
]

const statusConfig: Record<string, { label: string; className: string }> = {
  LEAD: { label: 'Lead', className: 'bg-slate-100 text-slate-700' },
  PROSPECT: { label: 'Prospect', className: 'bg-blue-100 text-blue-700' },
  CUSTOMER: { label: 'Customer', className: 'bg-emerald-100 text-emerald-700' },
  CHURNED: { label: 'Churned', className: 'bg-red-100 text-red-700' },
}

const avatarColors = ['bg-violet-100 text-violet-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']

export default function ContactsTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filtered = contacts.filter((c) => {
    const name = `${c.firstName} ${c.lastName}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase()) || c.email.includes(search.toLowerCase()) || c.account.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5">
          {Object.entries(statusConfig).map(([key, { label, className }]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? null : key)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                statusFilter === key
                  ? className + ' border-current'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <Button size="sm" className="ml-auto gap-2">
          <Plus className="w-4 h-4" /> Add Contact
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Contact', 'Title', 'Account', 'Status', 'Added', ''].map((col) => (
                <th key={col} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact, i) => {
              const { label, className } = statusConfig[contact.status]
              const colorClass = avatarColors[i % avatarColors.length]
              return (
                <tr key={contact.id} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={cn('text-xs font-semibold', colorClass)}>
                          {getInitials(`${contact.firstName} ${contact.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{contact.firstName} {contact.lastName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Mail className="w-3 h-3 text-muted-foreground/60" />
                          <span className="text-xs text-muted-foreground">{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{contact.title}</td>
                  <td className="px-5 py-3.5 text-sm">{contact.account}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', className)}>
                      {label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{formatRelative(contact.createdAt)}</td>
                  <td className="px-5 py-3.5">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No contacts found. Try adjusting your filters.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} contact{filtered.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  )
}
