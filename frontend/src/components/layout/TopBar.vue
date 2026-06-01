<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Car, LogOut, ShieldCheck } from 'lucide-vue-next'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
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
  <header class="sticky top-0 z-40 border-b border-white/5 bg-[#06060f]/90 backdrop-blur-xl">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
      <RouterLink class="flex items-center gap-3" to="/client">
        <div class="rounded-2xl bg-primary/20 p-3 text-primary shadow-[0_0_24px_rgba(139,92,246,0.18)]">
          <Car class="h-5 w-5" />
        </div>
        <span class="text-3xl font-semibold tracking-tight text-white">
          Car<span class="text-primary">GO</span>
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-8 md:flex">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          class="border-b-2 pb-1 text-lg font-medium transition"
          :class="route.path === item.to ? 'border-primary text-primary' : 'border-transparent text-white/55 hover:text-white'"
        >
          {{ t(item.labelKey) }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3">
        <LanguageSwitcher />
        <div class="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 md:flex">
          <ShieldCheck class="h-4 w-4 text-primary" />
          <span class="text-sm text-white">{{ authStore.currentAccount?.fullName }}</span>
        </div>
        <button class="btn-secondary !rounded-full !px-4 !py-3" type="button" @click="logout">
          <LogOut class="h-4 w-4" />
        </button>
      </div>
    </div>
  </header>
</template>
