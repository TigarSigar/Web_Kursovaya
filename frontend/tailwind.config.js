/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: 'rgb(var(--color-surface-base) / <alpha-value>)',
        'surface-strong': 'rgb(var(--color-surface-raised) / <alpha-value>)',
        foreground: 'rgb(var(--color-text-primary) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        faint: 'rgb(var(--color-text-muted) / <alpha-value>)',
        primary: 'rgb(var(--color-accent) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--color-accent-contrast) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-error) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        border: 'rgb(var(--color-border-default) / <alpha-value>)',
        input: 'rgb(var(--color-input-background) / <alpha-value>)',
        sidebar: 'rgb(var(--color-sidebar-background) / <alpha-value>)',
        'sidebar-border': 'rgb(var(--color-sidebar-border) / <alpha-value>)',
        'sidebar-muted': 'rgb(var(--color-sidebar-text-muted) / <alpha-value>)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        panel: 'var(--shadow-panel)',
        glow: 'var(--shadow-glow)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
      maxWidth: {
        'layout-content': 'var(--layout-content-max)',
        'layout-wide': 'var(--layout-content-wide-max)',
      },
    },
  },
  plugins: [],
}
