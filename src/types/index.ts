export type UserRole = 'ADMIN' | 'MANAGER' | 'REP'
export type DealStatus = 'OPEN' | 'WON' | 'LOST'
export type ContactStatus = 'LEAD' | 'PROSPECT' | 'CUSTOMER' | 'CHURNED'
export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK'
export type CompanySize = 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE'

export interface User {
  id: string
  supabaseId: string
  email: string
  name: string
  avatarUrl?: string | null
  role: UserRole
  organizationId: string
  createdAt: Date
}

export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: Date
}

export interface Account {
  id: string
  name: string
  website?: string | null
  industry?: string | null
  size?: CompanySize | null
  annualRevenue?: number | null
  phone?: string | null
  address?: string | null
  city?: string | null
  country?: string | null
  description?: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
  _count?: { contacts: number; deals: number }
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  title?: string | null
  avatarUrl?: string | null
  status: ContactStatus
  accountId?: string | null
  ownerId: string
  organizationId: string
  createdAt: Date
  updatedAt: Date
  account?: Account | null
  owner?: User
  tags?: Tag[]
}

export interface Pipeline {
  id: string
  name: string
  organizationId: string
  stages: PipelineStage[]
}

export interface PipelineStage {
  id: string
  name: string
  order: number
  color: string
  probability: number
  pipelineId: string
  _count?: { deals: number }
}

export interface Deal {
  id: string
  title: string
  value: number
  currency: string
  status: DealStatus
  probability: number
  closeDate?: Date | null
  description?: string | null
  stageId: string
  pipelineId: string
  ownerId: string
  accountId?: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
  stage?: PipelineStage
  owner?: User
  account?: Account | null
  contacts?: Contact[]
}

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string | null
  dueAt?: Date | null
  completedAt?: Date | null
  userId: string
  dealId?: string | null
  contactId?: string | null
  accountId?: string | null
  organizationId: string
  createdAt: Date
  updatedAt: Date
  user?: User
  deal?: Deal | null
  contact?: Contact | null
}

export interface Tag {
  id: string
  name: string
  color: string
  organizationId: string
}

export interface DashboardStats {
  totalDeals: number
  totalValue: number
  wonDeals: number
  wonValue: number
  openDeals: number
  openValue: number
  conversionRate: number
  avgDealSize: number
}

export interface PipelineWithDeals extends Pipeline {
  deals: Deal[]
}
