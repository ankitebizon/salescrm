import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const STAGE_COLORS: Record<string, string> = {
  Lead: '#94a3b8',
  Qualified: '#60a5fa',
  Proposal: '#a78bfa',
  Negotiation: '#fb923c',
  'Closed Won': '#34d399',
  'Closed Lost': '#f87171',
}

export const ACTIVITY_ICONS: Record<string, string> = {
  CALL: '📞',
  EMAIL: '✉️',
  MEETING: '🤝',
  NOTE: '📝',
  TASK: '✅',
}
