export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const orgId = user.organizationId
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const WON_STATUSES = ['WON', 'closed_won', 'Closed Won', 'CLOSED_WON']
    const LOST_STATUSES = ['LOST', 'closed_lost', 'Closed Lost', 'CLOSED_LOST']
    const OPEN_STATUSES = ['OPEN', 'open', 'Open']

    const [totalDeals, wonDealsThisMonth, openDeals, allDeals] = await Promise.all([
      prisma.deal.count({ where: { organizationId: orgId } }),
      prisma.deal.findMany({
        where: {
          organizationId: orgId,
          status: { in: WON_STATUSES as any[] },
          closeDate: { gte: startOfMonth },
        },
        select: { value: true, status: true, closeDate: true },
      }),
      prisma.deal.findMany({
        where: { organizationId: orgId, status: { in: OPEN_STATUSES as any[] } },
        select: { value: true },
      }),
      prisma.deal.findMany({
        where: { organizationId: orgId },
        select: { value: true, status: true },
      }),
    ])

    console.log('[dashboard/stats] wonDealsThisMonth raw:', JSON.stringify(wonDealsThisMonth))
    console.log('[dashboard/stats] allDeals statuses:', allDeals.map(d => d.status))

    const wonValue = wonDealsThisMonth.reduce((s, d) => s + d.value, 0)
    const openValue = openDeals.reduce((s, d) => s + d.value, 0)
    const totalValue = allDeals.reduce((s, d) => s + d.value, 0)
    const wonCount = allDeals.filter(d => WON_STATUSES.includes(d.status as string)).length
    const lostCount = allDeals.filter(d => LOST_STATUSES.includes(d.status as string)).length
    const closedCount = wonCount + lostCount
    const conversionRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0

    return NextResponse.json({
      totalDeals,
      totalValue,
      wonDeals: wonDealsThisMonth.length,
      wonValue,
      openDeals: openDeals.length,
      openValue,
      conversionRate,
      avgDealSize,
    })
  } catch (error) {
    console.error('[/api/dashboard/stats GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
