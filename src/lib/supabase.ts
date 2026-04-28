import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient()

export const createServerClient = () => {
  const { createServerComponentClient } = require('@supabase/auth-helpers-nextjs')
  const { cookies } = require('next/headers')
  return createServerComponentClient({ cookies })
}
