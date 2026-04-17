<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Car, UserCircle2 } from 'lucide-vue-next'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const authStore = useAuthStore()
const { t } = useI18n()

const navItems = computed(() =>
  authStore.userRole === 'CLIENT'
    ? [
        { labelKey: 'nav.home', to: '/' },
        { labelKey: 'nav.cars', to: '/cars' },
        { labelKey: 'nav.myRentals', to: '/client/rentals' },
      ]
    : [
        { labelKey: 'nav.home', to: '/' },
        { labelKey: 'nav.cars', to: '/cars' },
        { labelKey: 'nav.howItWorks', to: '/#how-it-works' },
      ],
)

const dashboardLink = computed(() => (authStore.userRole === 'FLEET_MANAGER' ? '/manager/account' : '/client/account'))
const bookNowLink = computed(() => '/cars')
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/5 bg-[#06060f]/90 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 py-4 lg:px-8">
      <div class="flex items-center justify-between gap-3">
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
          :class="
            route.path === item.to ||
            (item.to === '/client/rentals' && route.path.startsWith('/client/rentals'))
              ? 'border-primary text-primary'
              : 'border-transparent text-white/55 hover:text-white'
          "
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2 sm:gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
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
          class="btn-primary !px-6 !py-4 text-lg font-semibold"
          :to="bookNowLink"
        >
          {{ t('nav.bookNow') }}
        </RouterLink>
      </div>
      </div>

      <nav class="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
        <RouterLink
          v-for="item in navItems"
          :key="`${item.to}-mobile`"
          :to="item.to"
          class="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition"
          :class="
            route.path === item.to ||
            (item.to === '/client/rentals' && route.path.startsWith('/client/rentals'))
              ? 'border-primary bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
              : 'border-white/10 bg-white/[0.03] text-white/70 hover:border-white/20 hover:text-white'
          "
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
