'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Mail, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useContacts, useCreateContact, useUpdateContact, useDeleteContact } from '@/hooks/use-crm'
import { getInitials, formatRelative, cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

const statusConfig: Record<string, { label: string; className: string }> = {
  LEAD: { label: 'Lead', className: 'bg-slate-100 text-slate-700' },
  PROSPECT: { label: 'Prospect', className: 'bg-blue-100 text-blue-700' },
  CUSTOMER: { label: 'Customer', className: 'bg-emerald-100 text-emerald-700' },
  CHURNED: { label: 'Churned', className: 'bg-red-100 text-red-700' },
}

const avatarColors = [
  'bg-violet-100 text-violet-700', 'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700',
]

type ContactForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  title: string
  status: string
}

const emptyForm: ContactForm = { firstName: '', lastName: '', email: '', phone: '', title: '', status: 'LEAD' }

function ContactDialog({
  open, onClose, initial, onSave, title, saving,
}: {
  open: boolean
  onClose: () => void
  initial: ContactForm
  onSave: (data: ContactForm) => void
  title: string
  saving: boolean
}) {
  const [form, setForm] = useState<ContactForm>(initial)
  useEffect(() => { setForm(initial) }, [initial, open])

  const set = (field: keyof ContactForm, val: string) => setForm(p => ({ ...p, [field]: val }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <div className="space-y-1">
            <Label>First Name *</Label>
            <Input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" />
          </div>
          <div className="space-y-1">
            <Label>Last Name *</Label>
            <Input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Doe" />
          </div>
          <div className="space-y-1 col-span-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@company.com" />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555-0100" />
          </div>
          <div className="space-y-1">
            <Label>Title</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="CEO" />
          </div>
          <div className="space-y-1 col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={val => set('status', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={saving || !form.firstName || !form.lastName}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Save'}
          </Button>
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
        <DialogHeader>
          <DialogTitle>Delete Contact</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground py-2">
          Are you sure you want to delete <span className="font-medium text-foreground">{name}</span>? This action cannot be undone.
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

export default function ContactsTable() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editContact, setEditContact] = useState<any | null>(null)
  const [deleteContact, setDeleteContact] = useState<any | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const { data, isLoading } = useContacts({
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
  })

  const contacts = data?.contacts ?? []
  const total = data?.total ?? 0

  const createMut = useCreateContact()
  const updateMut = useUpdateContact()
  const deleteMut = useDeleteContact()

  const handleCreate = useCallback(async (form: ContactForm) => {
    try {
      await createMut.mutateAsync(form)
      setCreateOpen(false)
      toast({ title: 'Contact created' })
    } catch {
      toast({ title: 'Failed to create contact', variant: 'destructive' })
    }
  }, [createMut, toast])

  const handleEdit = useCallback(async (form: ContactForm) => {
    if (!editContact) return
    try {
      await updateMut.mutateAsync({ id: editContact.id, data: form })
      setEditContact(null)
      toast({ title: 'Contact updated' })
    } catch {
      toast({ title: 'Failed to update contact', variant: 'destructive' })
    }
  }, [editContact, updateMut, toast])

  const handleDelete = useCallback(async () => {
    if (!deleteContact) return
    try {
      await deleteMut.mutateAsync(deleteContact.id)
      setDeleteContact(null)
      toast({ title: 'Contact deleted' })
    } catch {
      toast({ title: 'Failed to delete contact', variant: 'destructive' })
    }
  }, [deleteContact, deleteMut, toast])

  return (
    <div className="bg-card rounded-xl border border-border">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-4 border-b border-border flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search contacts..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(statusConfig).map(([key, { label, className }]) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? null : key)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium transition-all border',
                statusFilter === key ? className + ' border-current' : 'bg-background text-muted-foreground border-border hover:bg-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <Button size="sm" className="ml-auto gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Add Contact
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading contacts...
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Contact', 'Title', 'Account', 'Status', 'Added', ''].map((col) => (
                  <th key={col} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact: any, i: number) => {
                const cfg = statusConfig[contact.status] ?? statusConfig.LEAD
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
                          {contact.email && (
                            <div className="flex items-center gap-2 mt-0.5">
                              <Mail className="w-3 h-3 text-muted-foreground/60" />
                              <span className="text-xs text-muted-foreground">{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">{contact.title || '—'}</td>
                    <td className="px-5 py-3.5 text-sm">{contact.account?.name || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', cfg.className)}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{formatRelative(contact.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1 rounded hover:bg-muted transition-colors"
                          onClick={() => setEditContact(contact)}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-destructive/10 transition-colors"
                          onClick={() => setDeleteContact(contact)}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {!isLoading && contacts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            {debouncedSearch || statusFilter
              ? 'No contacts match your filters.'
              : 'No contacts yet. Add your first contact!'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">{total} contact{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Create dialog */}
      <ContactDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        initial={emptyForm}
        onSave={handleCreate}
        title="Add Contact"
        saving={createMut.isPending}
      />

      {/* Edit dialog */}
      <ContactDialog
        open={!!editContact}
        onClose={() => setEditContact(null)}
        initial={editContact ? {
          firstName: editContact.firstName,
          lastName: editContact.lastName,
          email: editContact.email ?? '',
          phone: editContact.phone ?? '',
          title: editContact.title ?? '',
          status: editContact.status,
        } : emptyForm}
        onSave={handleEdit}
        title="Edit Contact"
        saving={updateMut.isPending}
      />

      {/* Delete dialog */}
      <DeleteDialog
        open={!!deleteContact}
        onClose={() => setDeleteContact(null)}
        onConfirm={handleDelete}
        name={deleteContact ? `${deleteContact.firstName} ${deleteContact.lastName}` : ''}
        deleting={deleteMut.isPending}
      />
    </div>
  )
}
