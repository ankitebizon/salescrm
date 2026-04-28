'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    // Wait for the auth-helpers to process the recovery token from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    // Also check if there's already a session (user navigated here with token)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' })
      return
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' })
      return
    }
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast({ title: 'Password updated successfully' })
      router.push('/dashboard')
    } catch (error: any) {
      toast({
        title: 'Failed to update password',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Verifying reset link...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !password || !confirm}>
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
        ) : (
          'Update password'
        )}
      </Button>
    </form>
  )
}
