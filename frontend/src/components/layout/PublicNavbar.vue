<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Car, UserCircle2 } from 'lucide-vue-next'
import LanguageSwitcher from '@/shared/ui/LanguageSwitcher.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/app/stores/auth'

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
  <header class="surface-nav sticky top-0 z-40 border-b">
    <div class="layout-container py-4">
      <div class="flex items-center justify-between gap-3">
        <RouterLink class="flex items-center gap-3" to="/">
          <div class="rounded-xl bg-primary/20 p-3 text-primary shadow-glow">
            <Car class="h-5 w-5" />
          </div>
          <span class="text-3xl font-semibold tracking-tight text-foreground">
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
              route.path === item.to || (item.to === '/client/rentals' && route.path.startsWith('/client/rentals'))
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
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
            class="hidden text-lg font-semibold text-foreground transition hover:text-primary md:inline-flex"
            :to="dashboardLink"
          >
            <UserCircle2 class="mr-2 h-5 w-5" />
            {{ t('nav.account') }}
          </RouterLink>
          <template v-else>
            <RouterLink
              class="hidden text-lg font-semibold text-foreground transition hover:text-primary md:inline-flex"
              to="/login"
            >
              {{ t('nav.login') }}
            </RouterLink>
            <RouterLink
              class="hidden text-lg font-semibold text-muted-foreground transition hover:text-foreground md:inline-flex"
              to="/register"
            >
              {{ t('nav.register') }}
            </RouterLink>
          </template>

          <RouterLink class="btn-primary px-6 py-4 text-lg font-semibold" :to="bookNowLink">
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
            route.path === item.to || (item.to === '/client/rentals' && route.path.startsWith('/client/rentals'))
              ? 'border-primary bg-primary text-primary-foreground shadow-glow'
              : 'border-border/60 bg-surface/70 text-muted-foreground hover:border-border/80 hover:text-foreground'
          "
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
