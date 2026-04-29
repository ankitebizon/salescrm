'use client'

import { useState, useCallback, useEffect } from 'react'
import { Plus, MoreHorizontal, TrendingUp, Loader2, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate, getInitials } from '@/lib/utils'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDeals, useCreateDeal, useUpdateDeal, useDeleteDeal, usePipelines, useAccounts } from '@/hooks/use-crm'
import { useToast } from '@/components/ui/use-toast'

type DealForm = {
  title: string
  value: string
  closeDate: string
  accountId: string
  probability: string
}

const emptyDealForm: DealForm = { title: '', value: '', closeDate: '', accountId: '', probability: '' }

function DealFormDialog({
  open, onClose, onSave, stageId, saving, accounts,
  initial, title: dialogTitle,
}: {
  open: boolean; onClose: () => void; onSave: (data: any) => void
  stageId?: string; saving: boolean; accounts: any[]
  initial?: DealForm; title: string
}) {
  const [form, setForm] = useState<DealForm>(initial ?? emptyDealForm)
  useEffect(() => { if (open) setForm(initial ?? emptyDealForm) }, [open])
  const set = (f: keyof DealForm, v: string) => setForm(p => ({ ...p, [f]: v }))

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>{dialogTitle}</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Deal Title *</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Acme Corp Enterprise" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Value ($)</Label>
              <Input type="number" value={form.value} onChange={e => set('value', e.target.value)} placeholder="50000" />
            </div>
            <div className="space-y-1">
              <Label>Probability (%)</Label>
              <Input type="number" min="0" max="100" value={form.probability} onChange={e => set('probability', e.target.value)} placeholder="50" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Close Date</Label>
            <Input type="date" value={form.closeDate} onChange={e => set('closeDate', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Account</Label>
            <Select value={form.accountId} onValueChange={v => set('accountId', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No account</SelectItem>
                {accounts.map((a: any) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={() => onSave({ ...form, stageId })} disabled={saving || !form.title}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Save Deal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDealDialog({ open, onClose, onConfirm, name, deleting }: {
  open: boolean; onClose: () => void; onConfirm: () => void; name: string; deleting: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Delete Deal</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground py-2">
          Delete <span className="font-medium text-foreground">&quot;{name}&quot;</span>? This cannot be undone.
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

function DealCard({ deal, stageColor, onEdit, onDelete }: {
  deal: any; stageColor: string; onEdit: () => void; onDelete: () => void
}) {
  const ownerInitials = deal.owner?.name ? getInitials(deal.owner.name) : '??'
  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('dealId', deal.id)
        e.dataTransfer.setData('fromStageId', deal.stageId)
        ;(e.currentTarget as HTMLElement).style.opacity = '0.5'
      }}
      onDragEnd={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
      className="bg-card border border-border rounded-lg p-3.5 cursor-grab active:cursor-grabbing deal-card-shadow group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          href={`/dashboard/deals/${deal.id}`}
          className="text-sm font-medium leading-snug line-clamp-2 hover:text-primary transition-colors flex-1"
          onClick={e => e.stopPropagation()}
        >
          {deal.title}
        </Link>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button className="p-0.5 rounded hover:bg-muted" onClick={e => { e.stopPropagation(); onEdit() }} title="Edit">
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </button>
          <button className="p-0.5 rounded hover:bg-destructive/10" onClick={e => { e.stopPropagation(); onDelete() }} title="Delete">
            <Trash2 className="w-3 h-3 text-destructive" />
          </button>
        </div>
      </div>

      {deal.account?.name && (
        <p className="text-xs text-muted-foreground mb-2.5">{deal.account.name}</p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">{formatCurrency(deal.value)}</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: stageColor }} />
          <span className="text-xs text-muted-foreground">{deal.probability ?? deal.stage?.probability ?? 0}%</span>
        </div>
      </div>

      <div className="mt-2.5 pt-2.5 border-t border-border/60 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {deal.closeDate ? formatDate(deal.closeDate) : 'No date'}
        </span>
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">{ownerInitials}</span>
        </div>
      </div>
    </div>
  )
}

export default function PipelineBoard() {
  const [addStageId, setAddStageId] = useState<string | null>(null)
  const [editDeal, setEditDeal] = useState<any | null>(null)
  const [deleteDeal, setDeleteDeal] = useState<any | null>(null)
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null)
  const { toast } = useToast()

  const { data: pipelines = [], isLoading: pipelinesLoading } = usePipelines()
  const pipeline = Array.isArray(pipelines) ? pipelines[0] : null

  const { data: deals = [], isLoading: dealsLoading } = useDeals(
    pipeline?.id ? { pipelineId: pipeline.id } : undefined
  )

  const { data: accounts = [] } = useAccounts()

  const createMut = useCreateDeal()
  const updateMut = useUpdateDeal()
  const deleteMut = useDeleteDeal()

  const dealsArr = Array.isArray(deals) ? deals : []
  const accountsArr = Array.isArray(accounts) ? accounts : []

  const getDealsByStage = (stageId: string) =>
    dealsArr.filter((d: any) => d.stageId === stageId)

  const handleDrop = useCallback(async (e: React.DragEvent, toStageId: string) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('dealId')
    const fromStageId = e.dataTransfer.getData('fromStageId')
    setDragOverStageId(null)
    if (!dealId || fromStageId === toStageId) return

    const stage = pipeline?.stages?.find((s: any) => s.id === toStageId)
    const stageName = (stage?.name ?? '').toLowerCase()
    const isWon = stageName.includes('won')
    const isLost = stageName.includes('lost')
    const status = isWon ? 'WON' : isLost ? 'LOST' : 'OPEN'
    const closeDate = (isWon || isLost) ? new Date().toISOString() : null
    try {
      await updateMut.mutateAsync({
        id: dealId,
        data: { stageId: toStageId, probability: stage?.probability, status, closeDate },
      })
    } catch {
      toast({ title: 'Failed to move deal', variant: 'destructive' })
    }
  }, [pipeline, updateMut, toast])

  const handleCreate = useCallback(async (form: DealForm & { stageId?: string }) => {
    if (!pipeline) return
    try {
      await createMut.mutateAsync({
        title: form.title,
        value: form.value ? parseFloat(form.value) : 0,
        probability: form.probability ? parseInt(form.probability) : undefined,
        closeDate: form.closeDate || undefined,
        accountId: form.accountId && form.accountId !== 'none' ? form.accountId : undefined,
        stageId: form.stageId,
        pipelineId: pipeline.id,
      })
      setAddStageId(null)
      toast({ title: 'Deal created' })
    } catch {
      toast({ title: 'Failed to create deal', variant: 'destructive' })
    }
  }, [pipeline, createMut, toast])

  const handleEdit = useCallback(async (form: DealForm & { stageId?: string }) => {
    if (!editDeal) return
    try {
      await updateMut.mutateAsync({
        id: editDeal.id,
        data: {
          title: form.title,
          value: form.value ? parseFloat(form.value) : 0,
          probability: form.probability ? parseInt(form.probability) : undefined,
          closeDate: form.closeDate || undefined,
          accountId: form.accountId && form.accountId !== 'none' ? form.accountId : undefined,
        },
      })
      setEditDeal(null)
      toast({ title: 'Deal updated' })
    } catch {
      toast({ title: 'Failed to update deal', variant: 'destructive' })
    }
  }, [editDeal, updateMut, toast])

  const handleDelete = useCallback(async () => {
    if (!deleteDeal) return
    try {
      await deleteMut.mutateAsync(deleteDeal.id)
      setDeleteDeal(null)
      toast({ title: 'Deal deleted' })
    } catch {
      toast({ title: 'Failed to delete deal', variant: 'destructive' })
    }
  }, [deleteDeal, deleteMut, toast])

  if (pipelinesLoading || dealsLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading pipeline...
      </div>
    )
  }

  if (!pipeline) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        No pipeline found. Make sure your account is set up correctly.
      </div>
    )
  }

  const stages = pipeline.stages ?? []
  const totalValue = dealsArr.reduce((s: number, d: any) => s + (d.value ?? 0), 0)
  const totalDeals = dealsArr.filter((d: any) => d.status === 'OPEN').length

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Total pipeline:</span>
          <span className="font-bold">{formatCurrency(totalValue)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalDeals}</span> open deals
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {stages.map((stage: any) => (
            <div key={stage.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
              <span>{getDealsByStage(stage.id).length}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 pipeline-scroll flex-1 min-h-0">
        {stages.map((stage: any) => {
          const stageDeals = getDealsByStage(stage.id)
          const stageValue = stageDeals.reduce((s: number, d: any) => s + (d.value ?? 0), 0)
          const isDragOver = dragOverStageId === stage.id

          return (
            <div
              key={stage.id}
              className={cn(
                'flex flex-col shrink-0 w-72 bg-muted/40 rounded-xl border overflow-hidden transition-colors',
                isDragOver ? 'border-primary/50 bg-primary/5' : 'border-border'
              )}
              onDragOver={e => { e.preventDefault(); setDragOverStageId(stage.id) }}
              onDragLeave={e => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverStageId(null)
              }}
              onDrop={e => handleDrop(e, stage.id)}
            >
              {/* Column header */}
              <div className="px-4 py-3 border-b border-border flex items-center gap-2 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: stage.color }} />
                <span className="font-semibold text-sm">{stage.name}</span>
                <span className="text-xs text-muted-foreground bg-background border border-border rounded-full px-2 py-0.5 ml-1">
                  {stageDeals.length}
                </span>
                <div className="ml-auto text-xs font-medium text-muted-foreground">
                  {formatCurrency(stageValue)}
                </div>
              </div>

              {/* Deal cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[200px]">
                {stageDeals.map((deal: any) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    stageColor={stage.color}
                    onEdit={() => setEditDeal(deal)}
                    onDelete={() => setDeleteDeal(deal)}
                  />
                ))}
              </div>

              {/* Add deal button */}
              <div className="p-3 shrink-0 border-t border-border">
                <button
                  className="w-full flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1.5 px-2 rounded-lg hover:bg-accent"
                  onClick={() => setAddStageId(stage.id)}
                >
                  <Plus className="w-4 h-4" /> Add deal
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Deal Dialog */}
      <DealFormDialog
        open={!!addStageId}
        onClose={() => setAddStageId(null)}
        onSave={handleCreate}
        stageId={addStageId ?? undefined}
        saving={createMut.isPending}
        accounts={accountsArr}
        title="Add Deal"
      />

      {/* Edit Deal Dialog */}
      {editDeal && (
        <DealFormDialog
          open={!!editDeal}
          onClose={() => setEditDeal(null)}
          onSave={handleEdit}
          saving={updateMut.isPending}
          accounts={accountsArr}
          title="Edit Deal"
          initial={{
            title: editDeal.title,
            value: editDeal.value?.toString() ?? '',
            closeDate: editDeal.closeDate ? new Date(editDeal.closeDate).toISOString().split('T')[0] : '',
            accountId: editDeal.accountId ?? '',
            probability: editDeal.probability?.toString() ?? '',
          }}
        />
      )}

      {/* Delete Deal Dialog */}
      <DeleteDealDialog
        open={!!deleteDeal}
        onClose={() => setDeleteDeal(null)}
        onConfirm={handleDelete}
        name={deleteDeal?.title ?? ''}
        deleting={deleteMut.isPending}
      />
    </div>
  )
}
