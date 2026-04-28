import { Metadata } from 'next'
import PipelineBoard from '@/components/crm/pipeline-board'

export const metadata: Metadata = { title: 'Deals' }

export default function DealsPage() {
  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground text-sm mt-1">Drag deals across stages to update status</p>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <PipelineBoard />
      </div>
    </div>
  )
}
