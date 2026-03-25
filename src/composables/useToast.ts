import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

// Module-level singleton — persists across route changes
const toasts = reactive<Toast[]>([])
let nextId = 1

export function useToast() {
  const addToast = (message: string, type: ToastType = 'success', duration = 3000) => {
    const id = nextId++
    toasts.push({ id, message, type })
    setTimeout(() => removeToast(id), duration)
  }

  const removeToast = (id: number) => {
    const index = toasts.findIndex(t => t.id === id)
    if (index !== -1) toasts.splice(index, 1)
  }

  return { toasts, addToast, removeToast }
}
