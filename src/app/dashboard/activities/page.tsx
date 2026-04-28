import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Activities' }

const activities = [
  { id: '1', type: 'CALL', title: 'Discovery call with Sarah Johnson', deal: 'Acme Corp Enterprise', contact: 'Sarah Johnson', user: 'John Doe', dueAt: new Date(Date.now() + 86400000), completedAt: null },
  { id: '2', type: 'EMAIL', title: 'Send proposal to TechCo', deal: 'TechCo Pro Annual', contact: 'Marcus Chen', user: 'Mike Chen', dueAt: new Date(Date.now() - 86400000), completedAt: new Date(Date.now() - 82000000) },
  { id: '3', type: 'MEETING', title: 'Demo with Globex team', deal: 'Globex Starter Bundle', contact: 'Emily Rivera', user: 'John Doe', dueAt: new Date(Date.now() + 86400000 * 3), completedAt: null },
  { id: '4', type: 'TASK', title: 'Follow up on contract signature', deal: 'Acme Corp Enterprise', contact: 'Sarah Johnson', user: 'John Doe', dueAt: new Date(Date.now() + 86400000 * 2), completedAt: null },
  { id: '5', type: 'NOTE', title: 'Budget confirmed for Q2', deal: 'Initech Growth Plan', contact: 'David Park', user: 'Lisa Park', dueAt: null, completedAt: new Date(Date.now() - 3600000) },
]

const typeConfig: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  CALL: { label: 'Call', bg: 'bg-blue-100', color: 'text-blue-600', icon: '📞' },
  EMAIL: { label: 'Email', bg: 'bg-violet-100', color: 'text-violet-600', icon: '✉️' },
  MEETING: { label: 'Meeting', bg: 'bg-emerald-100', color: 'text-emerald-600', icon: '🤝' },
  TASK: { label: 'Task', bg: 'bg-amber-100', color: 'text-amber-600', icon: '✅' },
  NOTE: { label: 'Note', bg: 'bg-rose-100', color: 'text-rose-600', icon: '📝' },
}

export default function ActivitiesPage() {
  const upcoming = activities.filter(a => !a.completedAt && a.dueAt)
  const completed = activities.filter(a => !!a.completedAt)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
        <p className="text-muted-foreground text-sm mt-1">Track calls, emails, meetings, and tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold">Upcoming ({upcoming.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {upcoming.map((activity) => {
              const cfg = typeConfig[activity.type]
              return (
                <div key={activity.id} className="p-4 flex gap-3 hover:bg-muted/20 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center text-base shrink-0`}>
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.deal} · {activity.contact}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                      {activity.dueAt && (
                        <span className="text-xs text-muted-foreground">
                          Due {new Date(activity.dueAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Completed */}
        <div className="bg-card rounded-xl border border-border">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold">Completed ({completed.length})</h2>
          </div>
          <div className="divide-y divide-border">
            {completed.map((activity) => {
              const cfg = typeConfig[activity.type]
              return (
                <div key={activity.id} className="p-4 flex gap-3 hover:bg-muted/20 transition-colors opacity-70">
                  <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center text-base shrink-0`}>
                    {cfg.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-through">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{activity.deal}</p>
                    <span className="text-xs text-emerald-600 font-medium">Completed</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
