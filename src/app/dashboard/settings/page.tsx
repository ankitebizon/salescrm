import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and organization preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold">Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'First name', placeholder: 'John', defaultValue: 'John' },
            { label: 'Last name', placeholder: 'Doe', defaultValue: 'Doe' },
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-sm font-medium">{field.label}</label>
              <input
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                defaultValue={field.defaultValue}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Email</label>
          <input
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue="john@company.com"
            type="email"
          />
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
          Save changes
        </button>
      </div>

      {/* Organization */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h2 className="font-semibold">Organization</h2>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Company name</label>
          <input
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue="Acme Corp"
          />
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
          Save
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/20 rounded-xl p-6 space-y-3">
        <h2 className="font-semibold text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="px-4 py-2 border border-destructive text-destructive text-sm font-medium rounded-lg hover:bg-destructive/5 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  )
}
