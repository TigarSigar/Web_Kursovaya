import { defineStore } from 'pinia'
import { applyTheme, initTheme, type AppTheme } from '@/app/providers/theme'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
}

interface UiState {
  toasts: ToastItem[]
  theme: AppTheme
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    toasts: [],
    theme: 'dark',
  }),
  actions: {
    initTheme() {
      this.theme = initTheme()
    },
    setTheme(theme: AppTheme) {
      this.theme = theme
      applyTheme(theme, { animate: true })
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark')
    },
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
