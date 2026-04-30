'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Globe, Building2, Pencil, Trash2, Loader2, Users, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAccounts, useAccount, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/use-crm'
import { formatCurrency, cn, getInitials } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

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

const SIZES = ['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']

type AccountForm = {
  name: string
  website: string
  industry: string
  size: string
  annualRevenue: string
  phone: string
  description: string
}

const emptyForm: AccountForm = {
  name: '', website: '', industry: '', size: 'SMALL',
  annualRevenue: '', phone: '', description: '',
}

function AccountDialog({
  open, onClose, initial, onSave, title, saving,
}: {
  open: boolean; onClose: () => void; initial: AccountForm
  onSave: (data: AccountForm) => void; title: string; saving: boolean
}) {
  const [form, setForm] = useState<AccountForm>(initial)
  useEffect(() => { setForm(initial) }, [initial, open])
  const set = (f: keyof AccountForm, v: string) => setForm(p => ({ ...p, [f]: v }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{title}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="space-y-1 col-span-2">
            <Label>Company Name *</Label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Acme Corp" />
          </div>
          <div className="space-y-1">
            <Label>Website</Label>
            <Input value={form.website} onChange={e => set('website', e.target.value)} placeholder="acmecorp.com" />
          </div>
          <div className="space-y-1">
            <Label>Industry</Label>
            <Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="Technology" />
          </div>
          <div className="space-y-1">
            <Label>Company Size</Label>
            <Select value={form.size} onValueChange={v => set('size', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SIZES.map(s => <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Annual Revenue ($)</Label>
            <Input type="number" value={form.annualRevenue} onChange={e => set('annualRevenue', e.target.value)} placeholder="1000000" />
          </div>
          <div className="space-y-1 col-span-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555-0100" />
          </div>
          <div className="space-y-1 col-span-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={saving || !form.name}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const contactStatusConfig: Record<string, { label: string; className: string }> = {
  LEAD: { label: 'Lead', className: 'bg-slate-100 text-slate-700' },
  PROSPECT: { label: 'Prospect', className: 'bg-blue-100 text-blue-700' },
  CUSTOMER: { label: 'Customer', className: 'bg-emerald-100 text-emerald-700' },
  CHURNED: { label: 'Churned', className: 'bg-red-100 text-red-700' },
}

function AccountContactsDialog({ accountId, onClose }: { accountId: string; onClose: () => void }) {
  const { data: account, isLoading } = useAccount(accountId)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {account?.name ?? 'Account'} — Contacts
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
          </div>
        ) : !account?.contacts?.length ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            No contacts linked to this account yet.
          </p>
        ) : (
          <div className="divide-y divide-border max-h-96 overflow-y-auto">
            {account.contacts.map((c: any) => {
              const cfg = contactStatusConfig[c.status] ?? contactStatusConfig.LEAD
              return (
                <div key={c.id} className="flex items-center gap-3 py-3">
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="text-xs font-semibold bg-violet-100 text-violet-700">
                      {getInitials(`${c.firstName} ${c.lastName}`)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{c.firstName} {c.lastName}</p>
                    {c.email && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-muted-foreground/60" />
                        <span className="text-xs text-muted-foreground truncate">{c.email}</span>
                      </div>
                    )}
                    {c.title && <p className="text-xs text-muted-foreground">{c.title}</p>}
                  </div>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full shrink-0', cfg.className)}>
                    {cfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({ open, onClose, onConfirm, name, deleting }: {
  open: boolean; onClose: () => void; onConfirm: () => void; name: string; deleting: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Delete Account</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground py-2">
          Delete <span className="font-medium text-foreground">{name}</span>? This cannot be undone.
        </p>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={deleting}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={deleting}>
            {deleting ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deleting...</> : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AccountsGrid() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editAccount, setEditAccount] = useState<any | null>(null)
  const [deleteAccount, setDeleteAccount] = useState<any | null>(null)
  const [contactsAccountId, setContactsAccountId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data: accounts = [], isLoading } = useAccounts({ search: debouncedSearch || undefined })

  const createMut = useCreateAccount()
  const updateMut = useUpdateAccount()
  const deleteMut = useDeleteAccount()

  const handleCreate = useCallback(async (form: AccountForm) => {
    try {
      await createMut.mutateAsync({
        ...form,
        annualRevenue: form.annualRevenue ? parseFloat(form.annualRevenue) : undefined,
      })
      setCreateOpen(false)
      toast({ title: 'Account created' })
    } catch {
      toast({ title: 'Failed to create account', variant: 'destructive' })
    }
  }, [createMut, toast])

  const handleEdit = useCallback(async (form: AccountForm) => {
    if (!editAccount) return
    try {
      await updateMut.mutateAsync({
        id: editAccount.id,
        data: { ...form, annualRevenue: form.annualRevenue ? parseFloat(form.annualRevenue) : undefined },
      })
      setEditAccount(null)
      toast({ title: 'Account updated' })
    } catch {
      toast({ title: 'Failed to update account', variant: 'destructive' })
    }
  }, [editAccount, updateMut, toast])

  const handleDelete = useCallback(async () => {
    if (!deleteAccount) return
    try {
      await deleteMut.mutateAsync(deleteAccount.id)
      setDeleteAccount(null)
      toast({ title: 'Account deleted' })
    } catch {
      toast({ title: 'Failed to delete account', variant: 'destructive' })
    }
  }, [deleteAccount, deleteMut, toast])

  const filtered = Array.isArray(accounts) ? accounts.filter((a: any) =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || (a.industry || '').toLowerCase().includes(search.toLowerCase())
  ) : []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search accounts..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button size="sm" className="gap-2 ml-auto" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Add Account
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading accounts...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          {search ? 'No accounts match your search.' : 'No accounts yet. Add your first account!'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((account: any) => {
            const color = industryColors[account.industry] || '#6366f1'
            const contactCount = account._count?.contacts ?? 0
            const dealCount = account._count?.deals ?? 0
            const totalValue = (account.deals ?? []).reduce((s: number, d: any) => s + (d.value ?? 0), 0)

            return (
              <div
                key={account.id}
                className="bg-card rounded-xl border border-border p-5 hover:border-primary/30 transition-all deal-card-shadow group cursor-default"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: `${color}20`, color }}
                  >
                    {account.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      className="font-semibold text-sm group-hover:text-primary transition-colors text-left hover:underline"
                      onClick={() => setContactsAccountId(account.id)}
                    >
                      {account.name}
                    </button>
                    {account.website && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3 text-muted-foreground/60" />
                        <span className="text-xs text-muted-foreground truncate">{account.website}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      className="p-1 rounded hover:bg-muted"
                      onClick={() => setEditAccount(account)}
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-destructive/10"
                      onClick={() => setDeleteAccount(account)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                  </div>
                  {account.size && (
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium shrink-0', sizeColors[account.size] ?? 'bg-muted text-muted-foreground')}>
                      {account.size}
                    </span>
                  )}
                </div>

                {account.industry && (
                  <div className="flex items-center gap-1.5 mb-4">
                    <Building2 className="w-3.5 h-3.5" style={{ color }} />
                    <span className="text-xs font-medium" style={{ color }}>{account.industry}</span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Pipeline</p>
                    <p className="text-sm font-bold">{formatCurrency(totalValue)}</p>
                  </div>
                  <button
                    className="text-left hover:text-primary transition-colors"
                    onClick={() => setContactsAccountId(account.id)}
                  >
                    <p className="text-xs text-muted-foreground mb-0.5">Contacts</p>
                    <p className="text-sm font-bold">{contactCount}</p>
                  </button>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Deals</p>
                    <p className="text-sm font-bold">{dealCount}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AccountDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initial={emptyForm}
        onSave={handleCreate}
        title="Add Account"
        saving={createMut.isPending}
      />

      <AccountDialog
        open={!!editAccount}
        onClose={() => setEditAccount(null)}
        initial={editAccount ? {
          name: editAccount.name,
          website: editAccount.website ?? '',
          industry: editAccount.industry ?? '',
          size: editAccount.size ?? 'SMALL',
          annualRevenue: editAccount.annualRevenue?.toString() ?? '',
          phone: editAccount.phone ?? '',
          description: editAccount.description ?? '',
        } : emptyForm}
        onSave={handleEdit}
        title="Edit Account"
        saving={updateMut.isPending}
      />

      <DeleteDialog
        open={!!deleteAccount}
        onClose={() => setDeleteAccount(null)}
        onConfirm={handleDelete}
        name={deleteAccount?.name ?? ''}
        deleting={deleteMut.isPending}
      />

      {contactsAccountId && (
        <AccountContactsDialog
          accountId={contactsAccountId}
          onClose={() => setContactsAccountId(null)}
        />
      )}
    </div>
  )
}
