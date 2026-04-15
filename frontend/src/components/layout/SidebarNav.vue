<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import {
  BadgeRussianRuble,
  Car,
  ClipboardCheck,
  House,
  LayoutDashboard,
  LogOut,
  Search,
  Wrench,
} from 'lucide-vue-next'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
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
  <aside class="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/5 bg-[#070710] lg:flex lg:flex-col">
    <div class="border-b border-white/5 px-6 py-6">
      <div class="flex items-center gap-3">
        <div class="rounded-2xl bg-primary/20 p-3 text-primary shadow-[0_0_24px_rgba(139,92,246,0.18)]">
          <Car class="h-6 w-6" />
        </div>
        <div>
          <p class="text-3xl font-semibold tracking-tight text-white">
            Car<span class="text-primary">GO</span>
          </p>
          <p class="text-xs uppercase tracking-[0.28em] text-white/35">Fleet operations</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 space-y-2 px-4 py-6">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition"
        :class="
          isItemActive(item.to)
            ? 'bg-gradient-to-r from-primary to-[#8b5cf6] text-white shadow-[0_0_24px_rgba(139,92,246,0.22)]'
            : 'text-white/55 hover:bg-white/[0.04] hover:text-white'
        "
      >
        <component :is="iconMap[item.icon as keyof typeof iconMap]" class="h-4 w-4" />
        {{ t(item.labelKey) }}
      </RouterLink>
    </nav>

    <div class="border-t border-white/5 px-4 py-4">
      <div class="mb-3 flex items-center justify-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle compact />
      </div>
      <RouterLink to="/manager/account" class="mb-3 block rounded-[24px] border border-white/8 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.05]">
        <p class="text-sm font-medium text-white">{{ authStore.currentAccount?.fullName }}</p>
        <p class="text-xs text-white/45">{{ authStore.currentAccount?.email }}</p>
      </RouterLink>
      <button class="btn-secondary w-full justify-center" type="button" @click="logout">
        <LogOut class="h-4 w-4" />
        {{ t('nav.logout') }}
      </button>
    </div>
  </aside>
</template>
