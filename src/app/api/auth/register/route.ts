export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const { supabaseId, name, email, organizationName } = await request.json()

    if (!supabaseId || !name || !email || !organizationName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { supabaseId } })
    if (existingUser) {
      return NextResponse.json(existingUser)
    }

    const slug = slugify(organizationName) + '-' + Math.random().toString(36).slice(2, 8)

    const org = await prisma.organization.create({
      data: { name: organizationName, slug },
    })

    const user = await prisma.user.create({
      data: {
        supabaseId,
        name,
        email,
        organizationId: org.id,
        role: 'ADMIN',
      },
    })

    await prisma.pipeline.create({
      data: {
        name: 'Sales Pipeline',
        organizationId: org.id,
        stages: {
          create: [
            { name: 'Lead', order: 1, color: '#94a3b8', probability: 10 },
            { name: 'Qualified', order: 2, color: '#60a5fa', probability: 25 },
            { name: 'Proposal', order: 3, color: '#a78bfa', probability: 50 },
            { name: 'Negotiation', order: 4, color: '#fb923c', probability: 75 },
            { name: 'Closed Won', order: 5, color: '#34d399', probability: 100 },
          ],
        },
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
