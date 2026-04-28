import { Metadata } from 'next'
import AccountsGrid from '@/components/crm/accounts-grid'

export const metadata: Metadata = { title: 'Accounts' }

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
        <p className="text-muted-foreground text-sm mt-1">Companies and organizations in your CRM</p>
      </div>
      <AccountsGrid />
    </div>
  )
}
