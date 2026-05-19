<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Car, Eye, EyeOff, Shield } from 'lucide-vue-next'
import LanguageSwitcher from '@/shared/ui/LanguageSwitcher.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/app/stores/auth'
import { useUiStore } from '@/app/stores/ui'

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
      message:
        error instanceof Error ? error.message : locale.value === 'ru' ? 'Непредвиденная ошибка.' : 'Unexpected error.',
    })
  }
}

function selectClientPortal() {
  form.role = 'CLIENT'
  form.email = 'client@carrent.local'
}

function selectManagerPortal() {
  form.role = 'FLEET_MANAGER'
  form.email = 'manager@carrent.local'
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__toolbar">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>

    <div class="auth-page__layout">
      <section class="auth-page__hero">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(var(--color-accent),0.12),_transparent_32%)]"
        />
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
          <p class="auth-page__hero-text">
            {{ t('auth.heroSubtitle') }}
          </p>

          <div class="mt-12 grid gap-4 md:grid-cols-2">
            <div class="auth-page__feature-card">
              <Shield class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ t('auth.availabilityControl') }}</h2>
              <p class="auth-page__feature-text">{{ t('auth.availabilityDesc') }}</p>
            </div>
            <div class="auth-page__feature-card">
              <Shield class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ t('auth.operationalWorkflow') }}</h2>
              <p class="auth-page__feature-text">{{ t('auth.operationalDesc') }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="auth-page__panel">
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ t('auth.signIn') }}</p>
        <h2 class="mt-4 text-3xl font-semibold">{{ t('auth.accessAccount') }}</h2>
        <p class="auth-page__panel-text">{{ t('auth.chooseWorkspace') }}</p>

        <div class="auth-page__role-tabs">
          <button
            class="auth-page__role-button"
            :class="{ 'auth-page__role-button--active': form.role === 'CLIENT' }"
            type="button"
            @click="selectClientPortal"
          >
            {{ t('auth.clientPortal') }}
          </button>
          <button
            class="auth-page__role-button"
            :class="{ 'auth-page__role-button--active': form.role === 'FLEET_MANAGER' }"
            type="button"
            @click="selectManagerPortal"
          >
            {{ t('auth.fleetDesk') }}
          </button>
        </div>

        <form class="mt-8 space-y-5" @submit.prevent="login">
          <label class="field-group">
            <span class="field-label">{{ t('auth.email') }}</span>
            <input v-model="form.email" class="input-base" type="email" />
          </label>

          <label class="field-group">
            <span class="field-label">{{ t('auth.password') }}</span>
            <div class="relative">
              <input
                v-model="form.password"
                class="input-base pr-12"
                :type="showPassword.value ? 'text' : 'password'"
              />
              <button
                class="auth-page__password-toggle"
                type="button"
                @click="showPassword.value = !showPassword.value"
              >
                <Eye v-if="!showPassword.value" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </label>

          <button
            class="btn-primary flex w-full items-center justify-center px-6 py-4 text-lg font-semibold"
            type="submit"
          >
            {{ t('auth.continue') }}
          </button>
        </form>

        <div class="auth-page__footer">
          {{ t('auth.noAccount') }}
          <RouterLink class="ml-2 font-semibold text-primary hover:text-foreground" to="/register">{{
            t('auth.goRegister')
          }}</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>
