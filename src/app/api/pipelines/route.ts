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

    const pipelines = await prisma.pipeline.findMany({
      where: { organizationId: user.organizationId },
      include: {
        stages: {
          orderBy: { order: 'asc' },
          include: { _count: { select: { deals: true } } },
        },
      },
    })

    return NextResponse.json(pipelines)
  } catch (error) {
    console.error('[/api/pipelines GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
