'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (error: any) {
      toast({
        title: 'Failed to send reset email',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">Check your email</h3>
        <p className="text-muted-foreground text-sm">
          We sent a password reset link to <strong>{email}</strong>
        </p>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive it? Check your spam folder or{' '}
          <button
            className="text-primary hover:underline"
            onClick={() => setSent(false)}
          >
            try again
          </button>
        </p>
        <Link href="/auth/login" className="text-primary hover:underline text-sm font-medium block mt-4">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || !email}>
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
        ) : (
          'Send reset link'
        )}
      </Button>
      <Link
        href="/auth/login"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors justify-center"
      >
        <ArrowLeft className="w-4 h-4" /> Back to sign in
      </Link>
    </form>
  )
}
