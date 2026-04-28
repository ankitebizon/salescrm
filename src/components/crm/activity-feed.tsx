'use client'

import { Phone, Mail, Users, FileText, CheckSquare, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { cn, formatRelative } from '@/lib/utils'
import { useActivities } from '@/hooks/use-crm'

const icons: Record<string, any> = {
  CALL: { icon: Phone, color: 'bg-blue-100 text-blue-600' },
  EMAIL: { icon: Mail, color: 'bg-violet-100 text-violet-600' },
  MEETING: { icon: Users, color: 'bg-emerald-100 text-emerald-600' },
  NOTE: { icon: FileText, color: 'bg-amber-100 text-amber-600' },
  TASK: { icon: CheckSquare, color: 'bg-rose-100 text-rose-600' },
}

export default function ActivityFeed() {
  const { data: allActivities = [], isLoading } = useActivities()
  const activities = (Array.isArray(allActivities) ? allActivities : []).slice(0, 8)

  return (
    <div className="bg-card rounded-xl border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-base">Recent Activity</h2>
        <Link href="/dashboard/activities" className="text-xs text-primary hover:underline">View all</Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading...
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">No activities yet</div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity: any, i: number) => {
            const cfg = icons[activity.type] ?? icons.NOTE
            const Icon = cfg.icon
            return (
              <div key={activity.id} className="flex gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', cfg.color)}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  {activity.deal && (
                    <p className="text-xs text-muted-foreground truncate">{activity.deal.title}</p>
                  )}
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-muted-foreground/60" />
                    <span className="text-xs text-muted-foreground/60">{formatRelative(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
