export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export async function GET() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const now = new Date()
    const ytdStart = new Date(now.getFullYear(), 0, 1)

    const allDeals = await prisma.deal.findMany({
      where: { organizationId: user.organizationId },
      include: {
        stage: true,
        owner: { select: { id: true, name: true } },
      },
    })

    // Won revenue by month (last 6 months)
    const monthlyMap: Record<string, number> = {}
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthlyMap[MONTH_NAMES[d.getMonth()]] = 0
    }
    allDeals
      .filter(d => d.status === 'WON' && d.closeDate)
      .forEach(deal => {
        const d = new Date(deal.closeDate!)
        const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
        if (diff >= 0 && diff < 6) {
          const key = MONTH_NAMES[d.getMonth()]
          monthlyMap[key] = (monthlyMap[key] || 0) + deal.value
        }
      })
    const monthlyWon = Object.entries(monthlyMap).map(([month, value]) => ({ month, value }))

    // Pipeline by stage (open deals only)
    const stageMap: Record<string, { name: string; value: number; deals: number; color: string }> = {}
    allDeals
      .filter(d => d.status === 'OPEN')
      .forEach(deal => {
        const key = deal.stage?.name || 'Unknown'
        if (!stageMap[key]) {
          stageMap[key] = { name: key, value: 0, deals: 0, color: deal.stage?.color || '#6366f1' }
        }
        stageMap[key].value += deal.value
        stageMap[key].deals++
      })
    const byStage = Object.values(stageMap)

    // Rep performance (closed deals)
    const repMap: Record<string, { name: string; won: number; lost: number }> = {}
    allDeals
      .filter(d => d.status !== 'OPEN')
      .forEach(deal => {
        const key = deal.owner?.name || 'Unknown'
        if (!repMap[key]) repMap[key] = { name: key, won: 0, lost: 0 }
        if (deal.status === 'WON') repMap[key].won += deal.value
        else repMap[key].lost += deal.value
      })
    const byRep = Object.values(repMap)

    // Summary cards
    const openDeals = allDeals.filter(d => d.status === 'OPEN')
    const wonDeals = allDeals.filter(d => d.status === 'WON')
    const lostDeals = allDeals.filter(d => d.status === 'LOST')
    const totalPipeline = openDeals.reduce((s, d) => s + d.value, 0)
    const wonYTD = allDeals
      .filter(d => d.status === 'WON' && d.closeDate && new Date(d.closeDate) >= ytdStart)
      .reduce((s, d) => s + d.value, 0)
    const totalClosed = wonDeals.length + lostDeals.length
    const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0
    const avgDealSize = wonDeals.length > 0 ? wonDeals.reduce((s, d) => s + d.value, 0) / wonDeals.length : 0

    return NextResponse.json({
      monthlyWon,
      byStage,
      byRep,
      summary: { totalPipeline, wonYTD, avgDealSize, winRate },
    })
  } catch (error) {
    console.error('Reports error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
