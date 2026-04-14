import { createApp } from 'vue'
import App from '@/App.vue'
import { router } from '@/router'
import { pinia } from '@/store'
import { useAuthStore } from '@/store/auth'
import '@/style.css'

async function bootstrap() {
  const app = createApp(App)
  app.use(pinia)

  const authStore = useAuthStore(pinia)
  await authStore.init()

  app.use(router)
  app.mount('#app')
}

bootstrap()
