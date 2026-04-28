export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '25')

    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const where = {
      organizationId: user.organizationId,
      ...(status && { status: status as any }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' as any } },
          { lastName: { contains: search, mode: 'insensitive' as any } },
          { email: { contains: search, mode: 'insensitive' as any } },
        ],
      }),
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: { account: { select: { id: true, name: true } }, owner: { select: { id: true, name: true } } },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contact.count({ where }),
    ])

    return NextResponse.json({ contacts, total, page, limit })
  } catch (error) {
    console.error('[/api/contacts GET]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const user = await prisma.user.findUnique({ where: { supabaseId: session.user.id } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const contact = await prisma.contact.create({
      data: {
        ...body,
        ownerId: user.id,
        organizationId: user.organizationId,
      },
      include: { account: true, owner: { select: { id: true, name: true } } },
    })

    return NextResponse.json(contact, { status: 201 })
  } catch (error) {
    console.error('[/api/contacts POST]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
