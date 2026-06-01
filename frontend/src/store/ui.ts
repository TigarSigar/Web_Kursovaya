import { defineStore } from 'pinia'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info'
}

export type AppTheme = 'dark' | 'light'

interface UiState {
  toasts: ToastItem[]
  theme: AppTheme
}

const THEME_STORAGE_KEY = 'cargo-theme'
const THEME_TRANSITION_CLASS = 'theme-transitioning'

let themeTransitionTimer: number | undefined

function syncTheme(theme: AppTheme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

function beginThemeTransition() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  document.documentElement.classList.add(THEME_TRANSITION_CLASS)

  if (themeTransitionTimer) {
    window.clearTimeout(themeTransitionTimer)
  }

  themeTransitionTimer = window.setTimeout(() => {
    document.documentElement.classList.remove(THEME_TRANSITION_CLASS)
    themeTransitionTimer = undefined
  }, 260)
}

export const useUiStore = defineStore('ui', {
  state: (): UiState => ({
    toasts: [],
    theme: 'dark',
  }),
  actions: {
    initTheme() {
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') {
        this.theme = saved
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        this.theme = 'light'
      }

      syncTheme(this.theme)
    },
    setTheme(theme: AppTheme) {
      beginThemeTransition()
      this.theme = theme
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
      syncTheme(theme)
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
