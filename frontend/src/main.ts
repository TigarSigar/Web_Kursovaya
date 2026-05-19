import { createApp } from 'vue'
import App from '@/App.vue'
import { router } from '@/app/router'
import { pinia } from '@/app/stores'
import { useAuthStore } from '@/app/stores/auth'
import { useUiStore } from '@/app/stores/ui'
import '@/app/styles/main.scss'

async function bootstrap() {
  const app = createApp(App)
  app.use(pinia)

  const authStore = useAuthStore(pinia)
  const uiStore = useUiStore(pinia)
  try {
    await authStore.init()
  } catch (error) {
    console.error('Auth init failed:', error)
  }
  uiStore.initTheme()

  app.use(router)
  app.mount('#app')
}

bootstrap()
