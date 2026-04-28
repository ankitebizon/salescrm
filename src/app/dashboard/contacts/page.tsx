import { Metadata } from 'next'
import ContactsTable from '@/components/crm/contacts-table'

export const metadata: Metadata = { title: 'Contacts' }

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your leads, prospects, and customers</p>
      </div>
      <ContactsTable />
    </div>
  )
}
