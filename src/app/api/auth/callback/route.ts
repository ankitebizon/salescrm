export const dynamic = 'force-dynamic'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

async function ensureUserInDb(supabaseId: string, email: string, metadata: any) {
  const existing = await prisma.user.findUnique({ where: { supabaseId } })
  if (existing) return

  const name = metadata?.name || email.split('@')[0] || 'User'
  const orgName = metadata?.organization_name || `${name}'s Organization`
  const slug = slugify(orgName) + '-' + Math.random().toString(36).slice(2, 8)

  const org = await prisma.organization.create({ data: { name: orgName, slug } })

  await prisma.user.create({
    data: { supabaseId, name, email, organizationId: org.id, role: 'ADMIN' },
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
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data } = await supabase.auth.exchangeCodeForSession(code)

    if (data?.session?.user) {
      const { user } = data.session
      try {
        await ensureUserInDb(user.id, user.email!, user.user_metadata)
      } catch (err) {
        console.error('Failed to create user in DB:', err)
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
