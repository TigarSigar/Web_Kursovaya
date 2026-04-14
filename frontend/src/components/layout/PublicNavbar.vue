<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Car, UserCircle2 } from 'lucide-vue-next'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

const navItems = [
  { labelKey: 'nav.home', to: '/' },
  { labelKey: 'nav.cars', to: '/cars' },
  { labelKey: 'nav.howItWorks', to: '/#how-it-works' },
  { labelKey: 'nav.contact', to: '/#contact' },
]

const dashboardLink = computed(() => (authStore.userRole === 'FLEET_MANAGER' ? '/manager' : '/client'))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/5 bg-[#06060f]/90 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
      <RouterLink class="flex items-center gap-3" to="/">
        <div class="rounded-2xl bg-primary/20 p-3 text-primary shadow-[0_0_24px_rgba(139,92,246,0.18)]">
          <Car class="h-5 w-5" />
        </div>
        <span class="text-3xl font-semibold tracking-tight text-white">
          Car<span class="text-primary">GO</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-8 md:flex">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="border-b-2 pb-1 text-lg font-medium transition"
          :class="route.path === item.to ? 'border-primary text-primary' : 'border-transparent text-white/55 hover:text-white'"
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-4">
        <LanguageSwitcher />
        <RouterLink
          v-if="authStore.isAuthenticated"
          class="hidden text-lg font-semibold text-white transition hover:text-primary md:inline-flex"
          :to="dashboardLink"
        >
          <UserCircle2 class="mr-2 h-5 w-5" />
          {{ t('nav.account') }}
        </RouterLink>
        <template v-else>
          <RouterLink class="hidden text-lg font-semibold text-white transition hover:text-primary md:inline-flex" to="/login">
            {{ t('nav.login') }}
          </RouterLink>
          <RouterLink class="hidden text-lg font-semibold text-white/75 transition hover:text-white md:inline-flex" to="/register">
            {{ t('nav.register') }}
          </RouterLink>
        </template>

        <RouterLink
          class="inline-flex items-center rounded-2xl bg-gradient-to-r from-primary to-[#8b5cf6] px-6 py-4 text-lg font-semibold text-white shadow-[0_0_28px_rgba(139,92,246,0.35)] transition hover:scale-[1.02]"
          to="/cars"
        >
          {{ t('nav.bookNow') }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>
