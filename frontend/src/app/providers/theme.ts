export type AppTheme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'cargo-theme'
const THEME_TRANSITION_CLASS = 'theme-transitioning'

let themeTransitionTimer: number | undefined

function getPreferredTheme(): AppTheme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function readStoredTheme(): AppTheme | null {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  return savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : null
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

export function applyTheme(theme: AppTheme, options?: { persist?: boolean; animate?: boolean }) {
  const { persist = true, animate = false } = options ?? {}

  if (animate) {
    beginThemeTransition()
  }

  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme

  if (persist) {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }
}

export function initTheme(): AppTheme {
  const initialTheme = readStoredTheme() ?? getPreferredTheme()
  applyTheme(initialTheme, { persist: false })
  return initialTheme
}
