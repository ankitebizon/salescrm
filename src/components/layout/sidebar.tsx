'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  Activity,
  BarChart3,
  Settings,
  ChevronLeft,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/deals', icon: Target, label: 'Deals' },
  { href: '/dashboard/contacts', icon: Users, label: 'Contacts' },
  { href: '/dashboard/accounts', icon: Building2, label: 'Accounts' },
  { href: '/dashboard/activities', icon: Activity, label: 'Activities' },
  { href: '/dashboard/reports', icon: BarChart3, label: 'Reports' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-border h-16 px-4 gap-3',
        collapsed && 'justify-center px-0'
      )}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight">SalesCRM</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                'hover:bg-accent hover:text-accent-foreground',
                active
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                  : 'text-muted-foreground',
                collapsed && 'justify-center px-0 w-10 h-10 mx-auto'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className={cn('p-3 border-t border-border space-y-1', collapsed && 'flex flex-col items-center')}>
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground',
            'hover:bg-accent hover:text-accent-foreground transition-all',
            collapsed && 'justify-center px-0 w-10 h-10'
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && 'Settings'}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center shadow-sm hover:bg-accent transition-colors z-10"
      >
        <ChevronLeft className={cn('w-3 h-3 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </aside>
  )
}
