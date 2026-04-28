'use client'

import { useState, useCallback, useEffect } from 'react'
import { Search, Bell, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import UserMenu from '@/components/layout/user-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCreateDeal, usePipelines, useAccounts, useActivities } from '@/hooks/use-crm'
import { useToast } from '@/components/ui/use-toast'
import { formatRelative, ACTIVITY_ICONS } from '@/lib/utils'

type DealForm = {
  title: string
  value: string
  closeDate: string
  accountId: string
  probability: string
}

const emptyDealForm: DealForm = { title: '', value: '', closeDate: '', accountId: '', probability: '' }

function NewDealDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<DealForm>(emptyDealForm)
  const { data: pipelines = [] } = usePipelines()
  const { data: accounts = [] } = useAccounts()
  const createMut = useCreateDeal()
  const { toast } = useToast()
  const pipeline = Array.isArray(pipelines) ? pipelines[0] : null
  const accountsArr = Array.isArray(accounts) ? accounts : []

  useEffect(() => { if (open) setForm(emptyDealForm) }, [open])
  const set = (f: keyof DealForm, v: string) => setForm(p => ({ ...p, [f]: v }))

  const handleSave = useCallback(async () => {
    if (!pipeline || !form.title) return
    const firstStage = pipeline.stages?.[0]
    try {
      await createMut.mutateAsync({
        title: form.title,
        value: form.value ? parseFloat(form.value) : 0,
        probability: form.probability ? parseInt(form.probability) : firstStage?.probability,
        closeDate: form.closeDate || undefined,
        accountId: form.accountId && form.accountId !== 'none' ? form.accountId : undefined,
        stageId: firstStage?.id,
        pipelineId: pipeline.id,
      })
      onClose()
      toast({ title: 'Deal created' })
    } catch {
      toast({ title: 'Failed to create deal', variant: 'destructive' })
    }
  }, [pipeline, form, createMut, toast, onClose])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New Deal</DialogTitle></DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Deal Title *</Label>
            <Input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Acme Corp Enterprise"
              autoFocus
            />
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
                {accountsArr.map((a: any) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={createMut.isPending}>Cancel</Button>
          <Button onClick={handleSave} disabled={createMut.isPending || !form.title}>
            {createMut.isPending
              ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</>
              : 'Save Deal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Header() {
  const [newDealOpen, setNewDealOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const { data: activities = [] } = useActivities()
  const activitiesArr = Array.isArray(activities) ? activities.slice(0, 8) : []

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-4 px-6 shrink-0">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts, deals, accounts..."
          className="pl-9 bg-background h-9 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button size="sm" className="gap-2" onClick={() => setNewDealOpen(true)}>
          <Plus className="w-4 h-4" />
          New Deal
        </Button>

        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-4 h-4" />
              {activitiesArr.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="font-semibold text-sm">Recent Activity</p>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {activitiesArr.length}
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {activitiesArr.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                activitiesArr.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-base leading-none mt-0.5">
                        {ACTIVITY_ICONS[activity.type] || '📌'}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug line-clamp-1">{activity.title}</p>
                        {activity.deal && (
                          <p className="text-xs text-muted-foreground">{activity.deal.title}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatRelative(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserMenu />
      </div>

      <NewDealDialog open={newDealOpen} onClose={() => setNewDealOpen(false)} />
    </header>
  )
}
