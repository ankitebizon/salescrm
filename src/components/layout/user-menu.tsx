'use client'

import { useEffect, useState } from 'react'
import { LogOut, User, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export default function UserMenu() {
  const router = useRouter()
  const supabase = createClient()
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserEmail(user.email || '')
      const res = await fetch('/api/users/me')
      if (res.ok) {
        const dbUser = await res.json()
        setUserName(dbUser.name || user.email?.split('@')[0] || 'User')
        setAvatarUrl(dbUser.avatarUrl || '')
      } else {
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'User')
      }
    }
    loadUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-accent transition-colors">
          <Avatar className="w-8 h-8">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={userName} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {userName ? getInitials(userName) : '?'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="font-medium">{userName || 'Loading...'}</p>
          <p className="text-muted-foreground text-xs font-normal">{userEmail}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <User className="mr-2 h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
          <Settings className="mr-2 h-4 w-4" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
