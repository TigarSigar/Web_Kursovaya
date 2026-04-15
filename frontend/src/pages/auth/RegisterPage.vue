<script setup lang="ts">
import { computed, reactive } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { Car, Shield, UserPlus } from 'lucide-vue-next'
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'

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
    const clientAccount = authStore.demoAccounts.find((item) => item.role === 'CLIENT') ?? authStore.demoAccounts[0]
    if (!clientAccount) {
      throw new Error(locale.value === 'ru' ? 'Демо-аккаунт клиента недоступен.' : 'Client demo account is unavailable.')
    }

    await authStore.login(clientAccount.id)
    uiStore.pushToast({
      type: 'success',
      title: locale.value === 'ru' ? 'Аккаунт создан' : 'Account created',
      message:
        locale.value === 'ru'
          ? 'Регистрация работает в mock-режиме. Вы автоматически вошли как клиент.'
          : 'Registration works in mock mode. You have been signed in as a client automatically.',
    })
    router.push('/client')
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: locale.value === 'ru' ? 'Не удалось завершить регистрацию' : 'Unable to complete registration',
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
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
            {{ t('auth.registerTitle') }}
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-8" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/50'">
            {{ t('auth.registerSubtitle') }}
          </p>

          <div class="mt-12 grid gap-4 md:grid-cols-2">
            <div class="rounded-3xl p-5" :class="uiStore.theme === 'light' ? 'border border-border bg-white/80' : 'border border-white/8 bg-white/[0.03]'">
              <UserPlus class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ locale === 'ru' ? 'Быстрый старт' : 'Fast onboarding' }}</h2>
              <p class="mt-2 text-sm leading-6" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">
                {{ locale === 'ru' ? 'Создайте аккаунт и сразу переходите к поиску доступных автомобилей.' : 'Create an account and jump straight into vehicle search.' }}
              </p>
            </div>
            <div class="rounded-3xl p-5" :class="uiStore.theme === 'light' ? 'border border-border bg-white/80' : 'border border-white/8 bg-white/[0.03]'">
              <Shield class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ locale === 'ru' ? 'Безопасный сценарий' : 'Secure access' }}</h2>
              <p class="mt-2 text-sm leading-6" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">
                {{ locale === 'ru' ? 'Доступ к клиентской зоне, арендам и статусам активируется сразу после регистрации.' : 'Client area, rentals, and status tracking become available right after sign up.' }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        class="rounded-[36px] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        :class="uiStore.theme === 'light' ? 'border border-border bg-white/88' : 'border border-white/8 bg-[#0b0b15]'"
      >
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ t('nav.register') }}</p>
        <h2 class="mt-4 text-3xl font-semibold">{{ t('auth.createAccount') }}</h2>
        <p class="mt-3 text-sm leading-6" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">{{ t('auth.registerSubtitle') }}</p>

        <form class="mt-8 space-y-5" @submit.prevent="register">
          <label class="field-group">
            <span class="field-label" :class="uiStore.theme === 'light' ? '!text-foreground' : '!text-white/85'">{{ t('auth.fullName') }}</span>
            <input v-model="form.fullName" class="input-base" :class="uiStore.theme === 'light' ? '!border-border !bg-white !text-foreground' : '!border-white/8 !bg-white/[0.03] !text-white'" type="text" />
          </label>

          <label class="field-group">
            <span class="field-label" :class="uiStore.theme === 'light' ? '!text-foreground' : '!text-white/85'">{{ t('auth.email') }}</span>
            <input v-model="form.email" class="input-base" :class="uiStore.theme === 'light' ? '!border-border !bg-white !text-foreground' : '!border-white/8 !bg-white/[0.03] !text-white'" type="email" />
          </label>

          <label class="field-group">
            <span class="field-label" :class="uiStore.theme === 'light' ? '!text-foreground' : '!text-white/85'">{{ t('auth.phone') }}</span>
            <input v-model="form.phone" class="input-base" :class="uiStore.theme === 'light' ? '!border-border !bg-white !text-foreground' : '!border-white/8 !bg-white/[0.03] !text-white'" type="tel" />
          </label>

          <label class="field-group">
            <span class="field-label" :class="uiStore.theme === 'light' ? '!text-foreground' : '!text-white/85'">{{ t('auth.password') }}</span>
            <input v-model="form.password" class="input-base" :class="uiStore.theme === 'light' ? '!border-border !bg-white !text-foreground' : '!border-white/8 !bg-white/[0.03] !text-white'" type="password" />
          </label>

          <button class="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary to-[#8b5cf6] px-6 py-4 text-lg font-semibold text-white shadow-[0_0_30px_rgba(139,92,246,0.28)] disabled:opacity-60" :disabled="!canSubmit" type="submit">
            {{ t('auth.goRegister') }}
          </button>
        </form>

        <div class="mt-6 text-center text-sm" :class="uiStore.theme === 'light' ? 'text-muted-foreground' : 'text-white/45'">
          {{ t('auth.haveAccount') }}
          <RouterLink class="ml-2 font-semibold text-primary hover:text-white" to="/login">{{ t('auth.goLogin') }}</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>
