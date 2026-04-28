'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export default function SettingsPage() {
  const { toast } = useToast()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const [orgName, setOrgName] = useState('')
  const [savingOrg, setSavingOrg] = useState(false)

  const [emailNotifs, setEmailNotifs] = useState(true)
  const [dealNotifs, setDealNotifs] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/users/me')
      if (res.ok) {
        const user = await res.json()
        setName(user.name || '')
        setEmail(user.email || '')
        setOrgName(user.organization?.name || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Profile updated' })
    } catch {
      toast({ title: 'Failed to update profile', variant: 'destructive' })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' })
      return
    }
    if (newPassword.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' })
      return
    }
    setSavingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setNewPassword('')
      setConfirmPassword('')
      toast({ title: 'Password updated successfully' })
    } catch (error: any) {
      toast({ title: error?.message || 'Failed to update password', variant: 'destructive' })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSaveOrg = async () => {
    setSavingOrg(true)
    try {
      const res = await fetch('/api/organizations/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName }),
      })
      if (!res.ok) throw new Error()
      toast({ title: 'Organization updated' })
    } catch {
      toast({ title: 'Failed to update organization', variant: 'destructive' })
    } finally {
      setSavingOrg(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading settings...
      </div>
    )
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${value ? 'bg-primary' : 'bg-muted-foreground/30'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
      />
    </button>
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and organization preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="space-y-1.5">
          <Label>Full Name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={email} disabled type="email" className="opacity-60 cursor-not-allowed" />
          <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
        </div>
        <Button onClick={handleSaveProfile} disabled={savingProfile || !name.trim()}>
          {savingProfile ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Save changes'}
        </Button>
      </div>

      {/* Change Password */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <div className="space-y-1.5">
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Confirm New Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </div>
        <Button onClick={handleChangePassword} disabled={savingPassword || !newPassword || !confirmPassword}>
          {savingPassword ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Updating...</> : 'Update password'}
        </Button>
      </div>

      {/* Organization */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Organization</h2>
        <div className="space-y-1.5">
          <Label>Company name</Label>
          <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="Your company" />
        </div>
        <Button onClick={handleSaveOrg} disabled={savingOrg || !orgName.trim()}>
          {savingOrg ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Save'}
        </Button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            {
              label: 'Email notifications',
              description: 'Receive email updates for important events',
              value: emailNotifs,
              onChange: setEmailNotifs,
            },
            {
              label: 'Deal activity alerts',
              description: 'Get notified when deals are updated or moved',
              value: dealNotifs,
              onChange: setDealNotifs,
            },
          ].map((pref) => (
            <div key={pref.label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{pref.description}</p>
              </div>
              <Toggle value={pref.value} onChange={pref.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-card border border-destructive/20 rounded-xl p-6 space-y-3">
        <h2 className="font-semibold text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2 border border-destructive text-destructive text-sm font-medium rounded-lg hover:bg-destructive/5 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  )
}
