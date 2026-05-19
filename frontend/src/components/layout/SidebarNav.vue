<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { BadgeRussianRuble, Car, ClipboardCheck, House, LayoutDashboard, LogOut, Search, Wrench } from 'lucide-vue-next'
import LanguageSwitcher from '@/shared/ui/LanguageSwitcher.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/app/stores/auth'
import { navigationItems } from '@/utils/navigation'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const iconMap = {
  LayoutDashboard,
  Car,
  BadgeRussianRuble,
  ClipboardCheck,
  Wrench,
  Search,
  House,
}

const items = computed(() => navigationItems.filter((item) => item.roles.includes('FLEET_MANAGER')))

function isItemActive(to: string) {
  if (to === '/manager') {
    return route.path === '/manager'
  }

  return route.path === to || route.path.startsWith(`${to}/`)
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <aside
    class="surface-nav fixed inset-y-0 left-0 z-[var(--z-sidebar)] hidden w-[var(--layout-sidebar-width)] border-r lg:flex lg:flex-col"
  >
    <div class="border-b border-border/40 px-6 py-6">
      <div class="flex items-center gap-3">
        <div class="rounded-xl bg-primary/20 p-3 text-primary shadow-glow">
          <Car class="h-6 w-6" />
        </div>
        <div>
          <p class="text-3xl font-semibold tracking-tight text-foreground">Car<span class="text-primary">GO</span></p>
          <p class="text-xs uppercase tracking-[0.28em] text-faint">Fleet operations</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 space-y-2 px-4 py-6">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition"
        :class="
          isItemActive(item.to)
            ? 'bg-gradient-to-r from-primary to-primary text-primary-foreground shadow-glow'
            : 'text-muted-foreground hover:bg-surface/80 hover:text-foreground'
        "
      >
        <component :is="iconMap[item.icon as keyof typeof iconMap]" class="h-4 w-4" />
        {{ t(item.labelKey) }}
      </RouterLink>
    </nav>

    <div class="border-t border-border/40 px-4 py-4">
      <div class="mb-3 flex items-center justify-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle compact />
      </div>
      <RouterLink
        to="/manager/account"
        class="mb-3 block rounded-xl border border-border/50 bg-surface/70 p-4 transition hover:border-border/70 hover:bg-surface/80"
      >
        <p class="text-sm font-medium text-foreground">{{ authStore.currentAccount?.fullName }}</p>
        <p class="text-xs text-muted-foreground">{{ authStore.currentAccount?.email }}</p>
      </RouterLink>
      <button class="btn-secondary w-full justify-center" type="button" @click="logout">
        <LogOut class="h-4 w-4" />
        {{ t('nav.logout') }}
      </button>
    </div>
  </aside>
</template>
