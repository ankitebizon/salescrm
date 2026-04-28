import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Pipeline } from '@/types'

interface CRMStore {
  currentUser: User | null
  currentPipeline: Pipeline | null
  sidebarCollapsed: boolean
  setCurrentUser: (user: User | null) => void
  setCurrentPipeline: (pipeline: Pipeline | null) => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useCRMStore = create<CRMStore>()(
  persist(
    (set) => ({
      currentUser: null,
      currentPipeline: null,
      sidebarCollapsed: false,
      setCurrentUser: (user) => set({ currentUser: user }),
      setCurrentPipeline: (pipeline) => set({ currentPipeline: pipeline }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    {
      name: 'crm-store',
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
)
