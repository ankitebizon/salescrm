export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const deal = await prisma.deal.findFirst({
      where: { id: params.id, organizationId: user.organizationId },
      include: {
        stage: true,
        pipeline: { include: { stages: { orderBy: { order: 'asc' } } } },
        owner: { select: { id: true, name: true, avatarUrl: true } },
        account: true,
        contacts: { include: { contact: { select: { id: true, firstName: true, lastName: true, email: true, title: true } } } },
        activities: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    return NextResponse.json(deal)
  } catch (error) {
    console.error('[/api/deals/:id GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.deal.updateMany({
      where: { id: params.id, organizationId: user.organizationId },
      data: { ...body, closeDate: body.closeDate ? new Date(body.closeDate) : undefined, updatedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/deals/:id PATCH]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.deal.deleteMany({ where: { id: params.id, organizationId: user.organizationId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/deals/:id DELETE]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
