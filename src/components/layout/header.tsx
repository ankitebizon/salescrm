'use client'

import { Search, Bell, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UserMenu from '@/components/layout/user-menu'

export default function Header() {
  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center gap-4 px-6 shrink-0">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts, deals, accounts..."
          className="pl-9 bg-background h-9 text-sm"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          New Deal
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}
