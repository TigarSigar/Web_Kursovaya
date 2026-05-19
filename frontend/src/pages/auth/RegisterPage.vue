<script setup lang="ts">
import { computed, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Car, Shield, UserPlus } from 'lucide-vue-next'
import LanguageSwitcher from '@/shared/ui/LanguageSwitcher.vue'
import ThemeToggle from '@/shared/ui/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/app/stores/auth'
import { useUiStore } from '@/app/stores/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()
const { t, locale } = useI18n()

const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
})

const canSubmit = computed(() => Boolean(form.fullName && form.email && form.phone && form.password))

async function register() {
  try {
    await authStore.registerClient({
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
    })
    uiStore.pushToast({
      type: 'success',
      title: locale.value === 'ru' ? 'Аккаунт создан' : 'Account created',
      message:
        locale.value === 'ru'
          ? 'Профиль клиента создан в backend и текущая сессия открыта.'
          : 'Client profile was created in the backend and the session is now active.',
    })
    router.push('/client')
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: locale.value === 'ru' ? 'Не удалось завершить регистрацию' : 'Unable to complete registration',
      message:
        error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  }
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
            {{ t('auth.registerTitle') }}
          </h1>
          <p class="auth-page__hero-text">
            {{ t('auth.registerSubtitle') }}
          </p>

          <div class="mt-12 grid gap-4 md:grid-cols-2">
            <div class="auth-page__feature-card">
              <UserPlus class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ locale === 'ru' ? 'Быстрый старт' : 'Fast onboarding' }}</h2>
              <p class="auth-page__feature-text">
                {{
                  locale === 'ru'
                    ? 'Создайте аккаунт и сразу переходите к поиску доступных автомобилей.'
                    : 'Create an account and jump straight into vehicle search.'
                }}
              </p>
            </div>
            <div class="auth-page__feature-card">
              <Shield class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">
                {{ locale === 'ru' ? 'Безопасный сценарий' : 'Secure access' }}
              </h2>
              <p class="auth-page__feature-text">
                {{
                  locale === 'ru'
                    ? 'Доступ к клиентской зоне, арендам и статусам активируется сразу после регистрации.'
                    : 'Client area, rentals, and status tracking become available right after sign up.'
                }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="auth-page__panel">
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ t('nav.register') }}</p>
        <h2 class="mt-4 text-3xl font-semibold">{{ t('auth.createAccount') }}</h2>
        <p class="auth-page__panel-text">{{ t('auth.registerSubtitle') }}</p>

        <form class="mt-8 space-y-5" @submit.prevent="register">
          <label class="field-group">
            <span class="field-label">{{ t('auth.fullName') }}</span>
            <input v-model="form.fullName" class="input-base" type="text" />
          </label>

          <label class="field-group">
            <span class="field-label">{{ t('auth.email') }}</span>
            <input v-model="form.email" class="input-base" type="email" />
          </label>

          <label class="field-group">
            <span class="field-label">{{ t('auth.phone') }}</span>
            <input v-model="form.phone" class="input-base" type="tel" />
          </label>

          <label class="field-group">
            <span class="field-label">{{ t('auth.password') }}</span>
            <input v-model="form.password" class="input-base" type="password" />
          </label>

          <button
            class="btn-primary flex w-full items-center justify-center px-6 py-4 text-lg font-semibold disabled:opacity-60"
            :disabled="!canSubmit"
            type="submit"
          >
            {{ t('auth.goRegister') }}
          </button>
        </form>

        <div class="auth-page__footer">
          {{ t('auth.haveAccount') }}
          <RouterLink class="ml-2 font-semibold text-primary hover:text-foreground" to="/login">{{
            t('auth.goLogin')
          }}</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>
