import { Metadata } from 'next'
import ReportsView from '@/components/crm/reports-view'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm mt-1">Sales analytics and performance insights</p>
      </div>
      <ReportsView />
    </div>
  )
}
