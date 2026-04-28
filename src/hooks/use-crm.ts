import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// ── Deals ──────────────────────────────────────────────────────
export function useDeals(params?: { pipelineId?: string; status?: string }) {
  const query = new URLSearchParams(params as any).toString()
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => fetch(`/api/deals?${query}`).then(r => r.json()),
  })
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: ['deals', id],
    queryFn: () => fetch(`/api/deals/${id}`).then(r => r.json()),
    enabled: !!id,
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
    },
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })
}

// ── Contacts ──────────────────────────────────────────────────
export function useContacts(params?: { search?: string; status?: string }) {
  const query = new URLSearchParams(params as any).toString()
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => fetch(`/api/contacts?${query}`).then(r => r.json()),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

// ── Accounts ──────────────────────────────────────────────────
export function useAccounts(params?: { search?: string }) {
  const query = new URLSearchParams(params as any).toString()
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => fetch(`/api/accounts?${query}`).then(r => r.json()),
  })
}

// ── Activities ────────────────────────────────────────────────
export function useActivities(params?: { dealId?: string; contactId?: string; completed?: string }) {
  const query = new URLSearchParams(params as any).toString()
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => fetch(`/api/activities?${query}`).then(r => r.json()),
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

// ── Pipelines ─────────────────────────────────────────────────
export function usePipelines() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => fetch('/api/pipelines').then(r => r.json()),
  })
}

// ── Dashboard Stats ───────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => fetch('/api/dashboard/stats').then(r => r.json()),
    staleTime: 5 * 60 * 1000,
  })
}
