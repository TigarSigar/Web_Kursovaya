import { createApp } from 'vue'
import App from '@/App.vue'
import { router } from '@/router'
import { pinia } from '@/store'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import '@/styles/main.scss'

async function bootstrap() {
  const app = createApp(App)
  app.use(pinia)

  const authStore = useAuthStore(pinia)
  const uiStore = useUiStore(pinia)
  await authStore.init()
  uiStore.initTheme()

  app.use(router)
  app.mount('#app')
}

bootstrap()
