export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({
      where: { supabaseId: session.user.id },
      include: { organization: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const user = await prisma.user.update({
      where: { supabaseId: session.user.id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
      },
      include: { organization: true },
    })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
