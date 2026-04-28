'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

const roleBadge: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  MANAGER: 'bg-blue-100 text-blue-700',
  REP: 'bg-emerald-100 text-emerald-700',
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/users/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setName(data.name || '')
        setAvatarUrl(data.avatarUrl || '')
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, avatarUrl: avatarUrl || null }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setUser(updated)
      toast({ title: 'Profile updated' })
    } catch {
      toast({ title: 'Failed to update profile', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading profile...
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal information</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Avatar preview */}
        <div className="flex items-center gap-5">
          <Avatar className="w-16 h-16">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {name ? getInitials(name) : '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1.5 inline-block ${roleBadge[user?.role] || 'bg-muted text-muted-foreground'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user?.email || ''} disabled type="email" className="opacity-60 cursor-not-allowed" />
          </div>
          <div className="space-y-1.5">
            <Label>Avatar URL</Label>
            <Input
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-xs text-muted-foreground">Enter a URL to your profile picture</p>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input value={user?.role || ''} disabled className="opacity-60 cursor-not-allowed" />
            <p className="text-xs text-muted-foreground">Contact your admin to change your role</p>
          </div>
          <div className="space-y-1.5">
            <Label>Organization</Label>
            <Input value={user?.organization?.name || ''} disabled className="opacity-60 cursor-not-allowed" />
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <Button onClick={handleSave} disabled={saving || !name.trim()}>
            {saving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
