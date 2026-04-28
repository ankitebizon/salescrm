import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const orgId = user.organizationId
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalDeals, wonDealsThisMonth, openDeals, allDeals] = await Promise.all([
      prisma.deal.count({ where: { organizationId: orgId } }),
      prisma.deal.findMany({
        where: { organizationId: orgId, status: 'WON', updatedAt: { gte: startOfMonth } },
        select: { value: true },
      }),
      prisma.deal.findMany({
        where: { organizationId: orgId, status: 'OPEN' },
        select: { value: true },
      }),
      prisma.deal.findMany({
        where: { organizationId: orgId },
        select: { value: true, status: true },
      }),
    ])

    const wonValue = wonDealsThisMonth.reduce((s, d) => s + d.value, 0)
    const openValue = openDeals.reduce((s, d) => s + d.value, 0)
    const totalValue = allDeals.reduce((s, d) => s + d.value, 0)
    const wonCount = allDeals.filter(d => d.status === 'WON').length
    const lostCount = allDeals.filter(d => d.status === 'LOST').length
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
