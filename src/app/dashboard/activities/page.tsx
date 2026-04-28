'use client'

import { useState, useCallback } from 'react'
import { Plus, Check, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity } from '@/hooks/use-crm'
import { useToast } from '@/components/ui/use-toast'
import { formatRelative } from '@/lib/utils'
import { cn } from '@/lib/utils'

const typeConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  CALL: { label: 'Call', bg: 'bg-blue-100', color: 'text-blue-600', icon: '📞' },
  EMAIL: { label: 'Email', bg: 'bg-violet-100', color: 'text-violet-600', icon: '✉️' },
  MEETING: { label: 'Meeting', bg: 'bg-emerald-100', color: 'text-emerald-600', icon: '🤝' },
  TASK: { label: 'Task', bg: 'bg-amber-100', color: 'text-amber-600', icon: '✅' },
  NOTE: { label: 'Note', bg: 'bg-rose-100', color: 'text-rose-600', icon: '📝' },
}

type ActivityForm = { type: string; title: string; dueAt: string; description: string }
const emptyForm: ActivityForm = { type: 'CALL', title: '', dueAt: '', description: '' }

function ActivityDialog({ open, onClose, onSave, saving }: {
  open: boolean; onClose: () => void; onSave: (data: ActivityForm) => void; saving: boolean
}) {
  const [form, setForm] = useState<ActivityForm>(emptyForm)
  const set = (f: keyof ActivityForm, v: string) => setForm(p => ({ ...p, [f]: v }))

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Log Activity</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={v => set('type', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(typeConfig).map(([k, { label }]) => (
                  <SelectItem key={k} value={k}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Discovery call with Acme"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label>Due Date</Label>
            <Input type="datetime-local" value={form.dueAt} onChange={e => set('dueAt', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Notes</Label>
            <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional notes" />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={saving || !form.title}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Log Activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ActivityItem({ activity, onComplete, onDelete, completing, deleting }: {
  activity: any; onComplete: () => void; onDelete: () => void
  completing: boolean; deleting: boolean
}) {
  const cfg = typeConfig[activity.type] ?? typeConfig.NOTE
  const isCompleted = !!activity.completedAt

  return (
    <div className={cn('p-4 flex gap-3 hover:bg-muted/20 transition-colors group', isCompleted && 'opacity-60')}>
      <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center text-base shrink-0`}>
        {cfg.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium', isCompleted && 'line-through')}>{activity.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          {activity.deal && <span className="text-xs text-muted-foreground">{activity.deal.title}</span>}
          {activity.contact && (
            <span className="text-xs text-muted-foreground">
              {activity.contact.firstName} {activity.contact.lastName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
          {activity.dueAt && (
            <span className="text-xs text-muted-foreground">
              Due {new Date(activity.dueAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {activity.user && (
            <span className="text-xs text-muted-foreground">· {activity.user.name}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!isCompleted && (
          <button
            className="p-1.5 rounded hover:bg-emerald-50 transition-colors"
            onClick={onComplete}
            disabled={completing}
            title="Mark complete"
          >
            {completing
              ? <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
              : <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        )}
        <button
          className="p-1.5 rounded hover:bg-destructive/10 transition-colors"
          onClick={onDelete}
          disabled={deleting}
          title="Delete"
        >
          {deleting
            ? <Loader2 className="w-3.5 h-3.5 text-destructive animate-spin" />
            : <Trash2 className="w-3.5 h-3.5 text-destructive" />}
        </button>
      </div>
    </div>
  )
}

export default function ActivitiesPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data: allActivities = [], isLoading, refetch } = useActivities()
  const activities = Array.isArray(allActivities) ? allActivities : []

  const createMut = useCreateActivity()
  const updateMut = useUpdateActivity()
  const deleteMut = useDeleteActivity()

  const upcoming = activities.filter((a: any) => !a.completedAt)
  const completed = activities.filter((a: any) => !!a.completedAt)

  const handleCreate = useCallback(async (form: ActivityForm) => {
    try {
      await createMut.mutateAsync({
        type: form.type,
        title: form.title,
        description: form.description || undefined,
        dueAt: form.dueAt || undefined,
      })
      setCreateOpen(false)
      toast({ title: 'Activity logged' })
    } catch {
      toast({ title: 'Failed to log activity', variant: 'destructive' })
    }
  }, [createMut, toast])

  const handleComplete = useCallback(async (id: string) => {
    setCompletingId(id)
    try {
      await updateMut.mutateAsync({ id, data: { completedAt: new Date().toISOString() } })
      toast({ title: 'Activity completed' })
    } catch {
      toast({ title: 'Failed to complete activity', variant: 'destructive' })
    } finally {
      setCompletingId(null)
    }
  }, [updateMut, toast])

  const handleDelete = useCallback(async (id: string) => {
    setDeletingId(id)
    try {
      await deleteMut.mutateAsync(id)
      toast({ title: 'Activity deleted' })
    } catch {
      toast({ title: 'Failed to delete activity', variant: 'destructive' })
    } finally {
      setDeletingId(null)
    }
  }, [deleteMut, toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground text-sm mt-1">Track calls, emails, meetings, and tasks</p>
        </div>
        <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> Log Activity
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading activities...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Upcoming ({upcoming.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">No upcoming activities</p>
              ) : upcoming.map((activity: any) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onComplete={() => handleComplete(activity.id)}
                  onDelete={() => handleDelete(activity.id)}
                  completing={completingId === activity.id}
                  deleting={deletingId === activity.id}
                />
              ))}
            </div>
          </div>

          {/* Completed */}
          <div className="bg-card rounded-xl border border-border">
            <div className="p-5 border-b border-border">
              <h2 className="font-semibold">Completed ({completed.length})</h2>
            </div>
            <div className="divide-y divide-border">
              {completed.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-10">No completed activities</p>
              ) : completed.map((activity: any) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onComplete={() => {}}
                  onDelete={() => handleDelete(activity.id)}
                  completing={false}
                  deleting={deletingId === activity.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <ActivityDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreate}
        saving={createMut.isPending}
      />
    </div>
  )
}
