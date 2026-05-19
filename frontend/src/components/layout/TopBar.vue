<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Car, LogOut, ShieldCheck } from 'lucide-vue-next'
import LanguageSwitcher from '@/shared/ui/LanguageSwitcher.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/app/stores/auth'
import { navigationItems } from '@/utils/navigation'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const items = computed(() => navigationItems.filter((item) => item.roles.includes('CLIENT')))

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="surface-nav sticky top-0 z-40 border-b">
    <div class="layout-container flex items-center justify-between py-4">
      <RouterLink class="flex items-center gap-3" to="/client">
        <div class="rounded-xl bg-primary/20 p-3 text-primary shadow-glow">
          <Car class="h-5 w-5" />
        </div>
        <span class="text-3xl font-semibold tracking-tight text-foreground">
          Car<span class="text-primary">GO</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-8 md:flex">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="border-b-2 pb-1 text-lg font-medium transition"
          :class="
            route.path === item.to
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          "
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3">
        <LanguageSwitcher />
        <div class="hidden items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-4 py-3 md:flex">
          <ShieldCheck class="h-4 w-4 text-primary" />
          <span class="text-sm text-foreground">{{ authStore.currentAccount?.fullName }}</span>
        </div>
        <button class="btn-secondary rounded-full px-4 py-3" type="button" @click="logout">
          <LogOut class="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
</template>
