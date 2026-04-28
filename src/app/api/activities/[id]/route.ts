import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const data: any = { ...body, updatedAt: new Date() }
    if (body.completedAt) data.completedAt = new Date(body.completedAt)
    if (body.dueAt) data.dueAt = new Date(body.dueAt)

    await prisma.activity.updateMany({
      where: { id: params.id, organizationId: user.organizationId },
      data,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    await prisma.activity.deleteMany({
      where: { id: params.id, organizationId: user.organizationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
