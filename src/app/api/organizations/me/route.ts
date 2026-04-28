import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const org = await prisma.organization.update({
      where: { id: user.organizationId },
      data: { ...(body.name !== undefined && { name: body.name }) },
    })
    return NextResponse.json(org)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
