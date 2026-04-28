import { Metadata } from 'next'
import { Suspense } from 'react'
import DashboardStats from '@/components/crm/dashboard-stats'
import RevenueChart from '@/components/crm/revenue-chart'
import RecentDeals from '@/components/crm/recent-deals'
import ActivityFeed from '@/components/crm/activity-feed'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata: Metadata = { title: 'Dashboard' }

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Your sales performance at a glance</p>
      </div>

      <Suspense fallback={<StatsSkeletons />}>
        <DashboardStats />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-80" />}>
            <RevenueChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<Skeleton className="h-80" />}>
            <ActivityFeed />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-64" />}>
        <RecentDeals />
      </Suspense>
    </div>
  )
}

function StatsSkeletons() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-xl" />
      ))}
    </div>
  )
}
