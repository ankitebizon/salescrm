'use client'

import { useState, useCallback } from 'react'
import { ArrowLeft, Edit, Trash2, Calendar, User, Building2, TrendingUp, Plus, Loader2, Check } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { formatCurrency, formatDate, ACTIVITY_ICONS } from '@/lib/utils'
import { useDeal, useUpdateDeal, useDeleteDeal, useCreateActivity, useUpdateActivity } from '@/hooks/use-crm'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

const activityTypeConfig: Record<string, { label: string; bg: string; color: string }> = {
  CALL: { label: 'Call', bg: 'bg-blue-100', color: 'text-blue-600' },
  EMAIL: { label: 'Email', bg: 'bg-violet-100', color: 'text-violet-600' },
  MEETING: { label: 'Meeting', bg: 'bg-emerald-100', color: 'text-emerald-600' },
  TASK: { label: 'Task', bg: 'bg-amber-100', color: 'text-amber-600' },
  NOTE: { label: 'Note', bg: 'bg-rose-100', color: 'text-rose-600' },
}

function EditDealDialog({ deal, open, onClose, onSave, saving }: {
  deal: any; open: boolean; onClose: () => void; onSave: (data: any) => void; saving: boolean
}) {
  const [form, setForm] = useState({
    title: deal.title,
    value: deal.value?.toString() ?? '',
    probability: deal.probability?.toString() ?? '',
    closeDate: deal.closeDate ? new Date(deal.closeDate).toISOString().split('T')[0] : '',
    status: deal.status,
    stageId: deal.stageId,
    description: deal.description ?? '',
  })
  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))
  const stages = deal.pipeline?.stages ?? []

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit Deal</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Value ($)</Label>
              <Input type="number" value={form.value} onChange={e => set('value', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Probability (%)</Label>
              <Input type="number" min="0" max="100" value={form.probability} onChange={e => set('probability', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Close Date</Label>
              <Input type="date" value={form.closeDate} onChange={e => set('closeDate', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="WON">Won</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {stages.length > 0 && (
            <div className="space-y-1">
              <Label>Stage</Label>
              <Select value={form.stageId} onValueChange={v => set('stageId', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {stages.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-1">
            <Label>Description</Label>
            <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional description" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={saving || !form.title}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LogActivityDialog({ dealId, open, onClose, onSave, saving }: {
  dealId: string; open: boolean; onClose: () => void; onSave: (data: any) => void; saving: boolean
}) {
  const [form, setForm] = useState({ type: 'CALL', title: '', dueAt: '' })
  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }))
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Log Activity</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={v => set('type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(activityTypeConfig).map(([k, { label }]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Discovery call" autoFocus />
          </div>
          <div className="space-y-1">
            <Label>Due Date</Label>
            <Input type="datetime-local" value={form.dueAt} onChange={e => set('dueAt', e.target.value)} />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave({ ...form, dealId })} disabled={saving || !form.title}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Log'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const [editOpen, setEditOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const { data: deal, isLoading } = useDeal(id)
  const updateMut = useUpdateDeal()
  const deleteMut = useDeleteDeal()
  const createActivity = useCreateActivity()
  const updateActivity = useUpdateActivity()

  const handleEdit = useCallback(async (form: any) => {
    try {
      await updateMut.mutateAsync({
        id,
        data: {
          title: form.title,
          value: form.value ? parseFloat(form.value) : 0,
          probability: form.probability ? parseInt(form.probability) : undefined,
          closeDate: form.closeDate || undefined,
          status: form.status,
          stageId: form.stageId,
          description: form.description || undefined,
        },
      })
      setEditOpen(false)
      toast({ title: 'Deal updated' })
    } catch {
      toast({ title: 'Failed to update deal', variant: 'destructive' })
    }
  }, [id, updateMut, toast])

  const handleDelete = useCallback(async () => {
    try {
      await deleteMut.mutateAsync(id)
      toast({ title: 'Deal deleted' })
      router.push('/dashboard/deals')
    } catch {
      toast({ title: 'Failed to delete deal', variant: 'destructive' })
    }
  }, [id, deleteMut, toast, router])

  const handleLogActivity = useCallback(async (data: any) => {
    try {
      await createActivity.mutateAsync(data)
      setLogOpen(false)
      toast({ title: 'Activity logged' })
    } catch {
      toast({ title: 'Failed to log activity', variant: 'destructive' })
    }
  }, [createActivity, toast])

  const handleCompleteActivity = useCallback(async (activityId: string) => {
    try {
      await updateActivity.mutateAsync({ id: activityId, data: { completedAt: new Date().toISOString() } })
      toast({ title: 'Activity completed' })
    } catch {
      toast({ title: 'Failed to complete activity', variant: 'destructive' })
    }
  }, [updateActivity, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading deal...
      </div>
    )
  }

  if (!deal || deal.error) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        Deal not found.{' '}
        <Link href="/dashboard/deals" className="text-primary hover:underline">Back to pipeline</Link>
      </div>
    )
  }

  const weightedValue = deal.value * ((deal.probability ?? 0) / 100)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Nav + actions */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/deals" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to pipeline
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
            <Edit className="w-3.5 h-3.5" /> Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/5"
            onClick={() => setDeleteConfirm(true)}
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
        </div>
      </div>

      {/* Deal header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold">{deal.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              {deal.stage && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: `${deal.stage.color}20`, color: deal.stage.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: deal.stage.color }} />
                  {deal.stage.name}
                </span>
              )}
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{deal.probability ?? 0}% probability</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted">{deal.status}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-bold">{formatCurrency(deal.value)}</p>
            <p className="text-sm text-muted-foreground mt-1">Weighted: {formatCurrency(weightedValue)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          {[
            { icon: Calendar, label: 'Close Date', value: deal.closeDate ? formatDate(deal.closeDate) : '—' },
            { icon: User, label: 'Owner', value: deal.owner?.name ?? '—' },
            { icon: Building2, label: 'Account', value: deal.account?.name ?? '—' },
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
          <h2 className="font-semibold text-sm mb-4">
            Contacts ({(deal.contacts ?? []).length})
          </h2>
          {(deal.contacts ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">No contacts linked</p>
          ) : (
            <div className="space-y-3">
              {(deal.contacts ?? []).map(({ contact }: any) => (
                <div key={contact.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {contact.firstName[0]}{contact.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.firstName} {contact.lastName}</p>
                    {contact.title && <p className="text-xs text-muted-foreground">{contact.title}</p>}
                    {contact.email && <p className="text-xs text-primary mt-0.5">{contact.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account */}
        {deal.account && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="font-semibold text-sm mb-4">Account</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                {deal.account.name[0]}
              </div>
              <div>
                <p className="font-medium text-sm">{deal.account.name}</p>
                {deal.account.industry && <p className="text-xs text-muted-foreground">{deal.account.industry}</p>}
              </div>
            </div>
            {deal.account.website && <p className="text-xs text-primary">{deal.account.website}</p>}
          </div>
        )}

        {/* Activity timeline */}
        <div className={`bg-card border border-border rounded-xl p-5 ${!deal.account ? 'lg:col-span-2' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Activity ({(deal.activities ?? []).length})</h2>
            <button
              className="text-xs text-primary hover:underline flex items-center gap-1"
              onClick={() => setLogOpen(true)}
            >
              <Plus className="w-3 h-3" /> Log
            </button>
          </div>
          {(deal.activities ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">No activities yet</p>
          ) : (
            <div className="space-y-4">
              {(deal.activities ?? []).map((activity: any, i: number) => (
                <div key={activity.id} className="flex gap-3 group">
                  <div className="flex flex-col items-center">
                    <span className="text-base">{ACTIVITY_ICONS[activity.type] ?? '📌'}</span>
                    {i < (deal.activities?.length ?? 0) - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                  </div>
                  <div className="pb-4 min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium leading-snug ${activity.completedAt ? 'line-through text-muted-foreground' : ''}`}>
                        {activity.title}
                      </p>
                      {!activity.completedAt && (
                        <button
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-emerald-50 transition-all shrink-0"
                          onClick={() => handleCompleteActivity(activity.id)}
                          title="Mark complete"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.user?.name} · {formatDate(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit dialog */}
      {editOpen && (
        <EditDealDialog
          deal={deal}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSave={handleEdit}
          saving={updateMut.isPending}
        />
      )}

      {/* Log activity dialog */}
      <LogActivityDialog
        dealId={id}
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSave={handleLogActivity}
        saving={createActivity.isPending}
      />

      {/* Delete confirm */}
      <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Deal</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground py-2">
            Delete <span className="font-medium text-foreground">&quot;{deal.title}&quot;</span>? This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(false)} disabled={deleteMut.isPending}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMut.isPending}>
              {deleteMut.isPending ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Deleting...</> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
