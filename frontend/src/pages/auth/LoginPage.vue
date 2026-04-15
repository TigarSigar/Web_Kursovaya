<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Car, Eye, EyeOff, Shield } from 'lucide-vue-next'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()

const form = reactive({
  email: 'client@carrent.local',
  password: 'password123',
  role: 'CLIENT' as 'CLIENT' | 'FLEET_MANAGER',
})

const showPassword = reactive({ value: false })
const accounts = computed(() => authStore.demoAccounts)

onMounted(async () => {
  await authStore.init()
})

async function login() {
  try {
    const account =
      accounts.value.find((item) => item.role === form.role) ??
      accounts.value.find((item) => item.email === form.email) ??
      accounts.value[0]

    if (!account) {
      return
    }

    await authStore.login(account.id)
    uiStore.pushToast({
      type: 'success',
      title: locale.value === 'ru' ? 'С возвращением' : 'Welcome back',
      message: locale.value === 'ru' ? 'Ваш аккаунт готов к работе.' : 'Your account is ready.',
    })

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : null
    router.push(redirect ?? (authStore.userRole === 'FLEET_MANAGER' ? '/manager' : '/'))
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: locale.value === 'ru' ? 'Не удалось войти' : 'Sign in failed',
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Непредвиденная ошибка.' : 'Unexpected error.',
    })
  }
}
</script>

<template>
  <div class="min-h-screen px-4 py-10" :class="uiStore.theme === 'light' ? 'bg-background text-foreground' : 'bg-[#05050d] text-white'">
    <div class="mx-auto mb-6 flex max-w-6xl justify-end gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>

    <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <section
        class="relative overflow-hidden rounded-[36px] p-8 lg:p-12"
        :class="
          uiStore.theme === 'light'
            ? 'border border-border bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.12),_transparent_44%)]'
            : 'border border-white/6 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.2),_transparent_44%)]'
        "
      >
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.12),_transparent_32%)]" />
        <div class="relative">
          <div class="flex items-center gap-3">
            <div class="rounded-2xl bg-primary/20 p-3 text-primary">
              <Car class="h-5 w-5" />
            </div>
            <span class="text-3xl font-semibold">Car<span class="text-primary">GO</span></span>
          </div>

          <h1 class="mt-12 max-w-3xl text-5xl font-semibold leading-[1.08] lg:text-6xl">
            {{ t('auth.heroTitle') }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/50'">
            {{ t('auth.heroSubtitle') }}
          </p>

          <div class="mt-12 grid gap-4 md:grid-cols-2">
            <div class="rounded-3xl p-5" :class="uiStore.theme === 'light' ? 'border border-border bg-white/80' : 'border border-white/8 bg-white/[0.03]'">
              <Shield class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ t('auth.availabilityControl') }}</h2>
              <p class="mt-2 text-sm leading-6" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">{{ t('auth.availabilityDesc') }}</p>
            </div>
            <div class="rounded-3xl p-5" :class="uiStore.theme === 'light' ? 'border border-border bg-white/80' : 'border border-white/8 bg-white/[0.03]'">
              <Shield class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ t('auth.operationalWorkflow') }}</h2>
              <p class="mt-2 text-sm leading-6" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">{{ t('auth.operationalDesc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-[36px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        :class="uiStore.theme === 'light' ? 'border border-border bg-white/88' : 'border border-white/8 bg-[#0b0b15]'"
      >
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ t('auth.signIn') }}</p>
        <h2 class="mt-4 text-3xl font-semibold">{{ t('auth.accessAccount') }}</h2>
        <p class="mt-3 text-sm leading-6" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">{{ t('auth.chooseWorkspace') }}</p>

        <div class="mt-8 flex rounded-2xl p-1" :class="uiStore.theme === 'light' ? 'bg-slate-100' : 'bg-white/[0.04]'">
          <button
            class="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition"
            :class="form.role === 'CLIENT' ? 'bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]' : uiStore.theme === 'light' ? 'text-slate-500' : 'text-white/55'"
            type="button"
            @click="form.role = 'CLIENT'; form.email = 'client@carrent.local'"
          >
            {{ t('auth.clientPortal') }}
          </button>
          <button
            class="flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition"
            :class="form.role === 'FLEET_MANAGER' ? 'bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]' : uiStore.theme === 'light' ? 'text-slate-500' : 'text-white/55'"
            type="button"
            @click="form.role = 'FLEET_MANAGER'; form.email = 'manager@carrent.local'"
          >
            {{ t('auth.fleetDesk') }}
          </button>
        </div>

        <form class="mt-8 space-y-5" @submit.prevent="login">
          <label class="field-group">
            <span class="field-label" :class="uiStore.theme === 'light' ? '!text-foreground' : '!text-white/85'">{{ t('auth.email') }}</span>
            <input v-model="form.email" class="input-base" :class="uiStore.theme === 'light' ? '!border-border !bg-white !text-foreground' : '!border-white/8 !bg-white/[0.03] !text-white'" type="email" />
          </label>

          <label class="field-group">
            <span class="field-label" :class="uiStore.theme === 'light' ? '!text-foreground' : '!text-white/85'">{{ t('auth.password') }}</span>
            <div class="relative">
              <input
                v-model="form.password"
                class="input-base !pr-12"
                :class="uiStore.theme === 'light' ? '!border-border !bg-white !text-foreground' : '!border-white/8 !bg-white/[0.03] !text-white'"
                :type="showPassword.value ? 'text' : 'password'"
              />
              <button class="absolute right-4 top-1/2 -translate-y-1/2" :class="uiStore.theme === 'light' ? 'text-slate-500' : 'text-white/45'" type="button" @click="showPassword.value = !showPassword.value">
                <Eye v-if="!showPassword.value" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </label>

          <button class="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-[#8b5cf6] px-6 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.28)]" type="submit">
            {{ t('auth.continue') }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">
          {{ t('auth.noAccount') }}
          <RouterLink class="ml-2 font-semibold text-primary hover:text-white" to="/register">{{ t('auth.goRegister') }}</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>
