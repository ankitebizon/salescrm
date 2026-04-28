import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => createClientComponentClient()

export const createServerClient = () => {
  const { createRouteHandlerClient } = require('@supabase/auth-helpers-nextjs')
  const { cookies } = require('next/headers')
  return createRouteHandlerClient({ cookies })
}
