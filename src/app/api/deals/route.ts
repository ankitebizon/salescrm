export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const pipelineId = searchParams.get('pipelineId')
  const status = searchParams.get('status')

  try {
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const deals = await prisma.deal.findMany({
      where: {
        organizationId: user.organizationId,
        ...(pipelineId && { pipelineId }),
        ...(status && { status: status as any }),
      },
      include: {
        stage: true,
        owner: { select: { id: true, name: true, avatarUrl: true } },
        account: { select: { id: true, name: true } },
        contacts: { include: { contact: { select: { id: true, firstName: true, lastName: true } } } },
      },
      orderBy: [{ stage: { order: 'asc' } }, { createdAt: 'desc' }],
    })

    return NextResponse.json(deals)
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

    const deal = await prisma.deal.create({
      data: {
        ...body,
        ownerId: user.id,
        organizationId: user.organizationId,
        closeDate: body.closeDate ? new Date(body.closeDate) : undefined,
      },
      include: { stage: true, owner: { select: { id: true, name: true } } },
    })

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
