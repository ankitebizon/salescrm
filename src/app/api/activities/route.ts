export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const dealId = searchParams.get('dealId')
  const contactId = searchParams.get('contactId')
  const completed = searchParams.get('completed')

  try {
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const activities = await prisma.activity.findMany({
      where: {
        organizationId: user.organizationId,
        ...(dealId && { dealId }),
        ...(contactId && { contactId }),
        ...(completed === 'true' && { completedAt: { not: null } }),
        ...(completed === 'false' && { completedAt: null }),
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        deal: { select: { id: true, title: true } },
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(activities)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const activity = await prisma.activity.create({
      data: {
        ...body,
        userId: user.id,
        organizationId: user.organizationId,
        dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
      },
      include: {
        user: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
      },
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
