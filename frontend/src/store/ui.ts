import { defineStore } from 'pinia'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
}

interface UiState {
  toasts: ToastItem[]
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    toasts: [],
  }),
  actions: {
    pushToast(toast: Omit<ToastItem, 'id'>) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      this.toasts.push({ ...toast, id })

      window.setTimeout(() => {
        this.removeToast(id)
      }, 3500)
    },
    removeToast(id: string) {
      this.toasts = this.toasts.filter((item) => item.id !== id)
    },
  },
})
