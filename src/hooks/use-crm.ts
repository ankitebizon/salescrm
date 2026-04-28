import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const QUERY_DEFAULTS = {
  staleTime: 300000,
  gcTime: 600000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
}

// ── Deals ──────────────────────────────────────────────────────
export function useDeals(params?: { pipelineId?: string; status?: string }) {
  const query = new URLSearchParams(params as any).toString()
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => fetch(`/api/deals?${query}`).then(r => r.json()),
    ...QUERY_DEFAULTS,
  })
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: ['deals', id],
    queryFn: () => fetch(`/api/deals/${id}`).then(r => r.json()),
    enabled: !!id,
    ...QUERY_DEFAULTS,
  })
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onMutate: async (newDeal) => {
      await queryClient.cancelQueries({ queryKey: ['deals'] })
      const previousQueries = queryClient.getQueriesData<any[]>({ queryKey: ['deals'] })
      queryClient.setQueriesData({ queryKey: ['deals'] }, (old: any) => {
        if (!Array.isArray(old)) return old
        return [{ id: `temp-${Date.now()}`, ...newDeal, createdAt: new Date().toISOString() }, ...old]
      })
      return { previousQueries }
    },
    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

export function useUpdateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetch(`/api/deals/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

export function useDeleteDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/deals/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

// ── Contacts ──────────────────────────────────────────────────
export function useContacts(params?: { search?: string; status?: string }) {
  const cleaned: Record<string, string> = {}
  if (params?.search) cleaned.search = params.search
  if (params?.status) cleaned.status = params.status
  const query = new URLSearchParams(cleaned).toString()
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => fetch(`/api/contacts?${query}`).then(r => r.json()),
    ...QUERY_DEFAULTS,
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onMutate: async (newContact) => {
      await queryClient.cancelQueries({ queryKey: ['contacts'] })
      const previousQueries = queryClient.getQueriesData<{ contacts: any[]; total: number }>({ queryKey: ['contacts'] })
      queryClient.setQueriesData({ queryKey: ['contacts'] }, (old: any) => {
        if (!old?.contacts) return old
        const optimistic = { id: `temp-${Date.now()}`, ...newContact, createdAt: new Date().toISOString() }
        return { ...old, contacts: [optimistic, ...old.contacts], total: old.total + 1 }
      })
      return { previousQueries }
    },
    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/contacts/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

// ── Accounts ──────────────────────────────────────────────────
export function useAccounts(params?: { search?: string }) {
  const cleaned: Record<string, string> = {}
  if (params?.search) cleaned.search = params.search
  const query = new URLSearchParams(cleaned).toString()
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => fetch(`/api/accounts?${query}`).then(r => r.json()),
    ...QUERY_DEFAULTS,
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] })
      const previousQueries = queryClient.getQueriesData<any[]>({ queryKey: ['accounts'] })
      queryClient.setQueriesData({ queryKey: ['accounts'] }, (old: any) => {
        if (!Array.isArray(old)) return old
        return [{ id: `temp-${Date.now()}`, ...newAccount, createdAt: new Date().toISOString() }, ...old]
      })
      return { previousQueries }
    },
    onError: (_err, _vars, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetch(`/api/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/accounts/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
  })
}

// ── Activities ────────────────────────────────────────────────
export function useActivities(params?: { dealId?: string; contactId?: string; completed?: string }) {
  const cleaned: Record<string, string> = {}
  if (params?.dealId) cleaned.dealId = params.dealId
  if (params?.contactId) cleaned.contactId = params.contactId
  if (params?.completed !== undefined) cleaned.completed = params.completed
  const query = new URLSearchParams(cleaned).toString()
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => fetch(`/api/activities?${query}`).then(r => r.json()),
    ...QUERY_DEFAULTS,
  })
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) =>
      fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })
}

export function useUpdateActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      fetch(`/api/activities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export function useDeleteActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/activities/${id}`, { method: 'DELETE' }).then(r => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

// ── Pipelines ─────────────────────────────────────────────────
export function usePipelines() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => fetch('/api/pipelines').then(r => r.json()),
    ...QUERY_DEFAULTS,
  })
}

// ── Dashboard Stats ───────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(r => r.json()),
    ...QUERY_DEFAULTS,
  })
}
