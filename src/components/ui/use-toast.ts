import * as React from 'react'
import type { ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 4000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
}

let count = 0
function genId() { return (++count).toString() }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const listeners: ((state: State) => void)[] = []
let memoryState: State = { toasts: [] }

type State = { toasts: ToasterToast[] }
type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.map(t => t.id === action.toastId || !action.toastId ? { ...t, open: false } : t) }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.toastId) }
    default:
      return state
  }
}

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach(l => l(memoryState))
}

function toast(props: Omit<ToasterToast, 'id'>) {
  const id = genId()
  dispatch({ type: 'ADD_TOAST', toast: { ...props, id, open: true, onOpenChange: (open) => { if (!open) dispatch({ type: 'DISMISS_TOAST', toastId: id }) } } })
  setTimeout(() => dispatch({ type: 'DISMISS_TOAST', toastId: id }), TOAST_REMOVE_DELAY)
  return { id }
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  React.useEffect(() => {
    listeners.push(setState)
    return () => { const idx = listeners.indexOf(setState); if (idx > -1) listeners.splice(idx, 1) }
  }, [])
  return { ...state, toast, dismiss: (id?: string) => dispatch({ type: 'DISMISS_TOAST', toastId: id }) }
}
