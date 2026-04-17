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
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
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
          <p class="auth-page__hero-text">
            {{ t('auth.registerSubtitle') }}
          </p>

          <div class="mt-12 grid gap-4 md:grid-cols-2">
            <div class="auth-page__feature-card">
              <UserPlus class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ locale === 'ru' ? 'Быстрый старт' : 'Fast onboarding' }}</h2>
              <p class="auth-page__feature-text">
                {{ locale === 'ru' ? 'Создайте аккаунт и сразу переходите к поиску доступных автомобилей.' : 'Create an account and jump straight into vehicle search.' }}
              </p>
            </div>
            <div class="auth-page__feature-card">
              <Shield class="h-6 w-6 text-primary" />
              <h2 class="mt-4 text-lg font-semibold">{{ locale === 'ru' ? 'Безопасный сценарий' : 'Secure access' }}</h2>
              <p class="auth-page__feature-text">
                {{ locale === 'ru' ? 'Доступ к клиентской зоне, арендам и статусам активируется сразу после регистрации.' : 'Client area, rentals, and status tracking become available right after sign up.' }}
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

          <button class="btn-primary flex w-full items-center justify-center !px-6 !py-4 text-lg font-semibold disabled:opacity-60" :disabled="!canSubmit" type="submit">
            {{ t('auth.goRegister') }}
          </button>
        </form>

        <div class="auth-page__footer">
          {{ t('auth.haveAccount') }}
          <RouterLink class="ml-2 font-semibold text-primary hover:text-white" to="/login">{{ t('auth.goLogin') }}</RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  padding: 40px 16px;
  background: rgb(var(--color-background));
  color: rgb(var(--color-foreground));

  &__toolbar,
  &__layout {
    max-width: 72rem;
    margin: 0 auto;
  }

  &__toolbar {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-bottom: 24px;
  }

  &__layout {
    display: grid;
    gap: 32px;
  }

  &__hero,
  &__panel {
    position: relative;
    overflow: hidden;
    padding: 32px;
    border: 1px solid var(--border-subtle);
    border-radius: 36px;
  }

  &__hero {
    background:
      radial-gradient(circle at top, rgba(139, 92, 246, 0.16), transparent 44%),
      var(--surface-panel);
  }

  &__panel {
    background: var(--surface-glass-strong);
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
  }

  &__hero-text,
  &__panel-text,
  &__feature-text,
  &__footer {
    margin-top: 12px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-muted);
  }

  &__hero-text {
    margin-top: 24px;
    max-width: 42rem;
    font-size: 18px;
    line-height: 1.8;
  }

  &__feature-card {
    padding: 20px;
    border: 1px solid var(--border-subtle);
    border-radius: 24px;
    background: var(--surface-glass);
  }

  &__footer {
    margin-top: 24px;
    text-align: center;
  }
}

@media (min-width: 1024px) {
  .auth-page__layout {
    grid-template-columns: 1.1fr 0.9fr;
  }

  .auth-page__hero,
  .auth-page__panel {
    padding: 48px;
  }
}
</style>
