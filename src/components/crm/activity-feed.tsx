import { Phone, Mail, Users, FileText, CheckSquare, Clock } from 'lucide-react'
import { cn, formatRelative } from '@/lib/utils'

const activities = [
  { type: 'CALL', title: 'Called Sarah Johnson', deal: 'Acme Corp - Enterprise', time: new Date(Date.now() - 1000 * 60 * 12), user: 'You' },
  { type: 'EMAIL', title: 'Sent proposal to TechCo', deal: 'TechCo - Pro Plan', time: new Date(Date.now() - 1000 * 60 * 45), user: 'Mike Chen' },
  { type: 'MEETING', title: 'Demo with Globex team', deal: 'Globex - Starter', time: new Date(Date.now() - 1000 * 60 * 120), user: 'You' },
  { type: 'NOTE', title: 'Updated deal notes', deal: 'Initech - Growth', time: new Date(Date.now() - 1000 * 60 * 200), user: 'Lisa Park' },
  { type: 'TASK', title: 'Follow up on contract', deal: 'Umbrella Corp', time: new Date(Date.now() - 1000 * 60 * 60 * 5), user: 'You' },
]

const icons: Record<string, any> = {
  CALL: { icon: Phone, color: 'bg-blue-100 text-blue-600' },
  EMAIL: { icon: Mail, color: 'bg-violet-100 text-violet-600' },
  MEETING: { icon: Users, color: 'bg-emerald-100 text-emerald-600' },
  NOTE: { icon: FileText, color: 'bg-amber-100 text-amber-600' },
  TASK: { icon: CheckSquare, color: 'bg-rose-100 text-rose-600' },
}

export default function ActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-base">Recent Activity</h2>
        <button className="text-xs text-primary hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, i) => {
          const { icon: Icon, color } = icons[activity.type]
          return (
            <div key={i} className="flex gap-3 group">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5', color)}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.deal}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground/60">{formatRelative(activity.time)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
