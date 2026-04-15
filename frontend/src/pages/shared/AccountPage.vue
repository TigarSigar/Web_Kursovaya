<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, MoonStar, ShieldCheck, SunMedium, UserRound } from 'lucide-vue-next'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { humanizeEnum } from '@/utils/format'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const { locale, t } = useI18n()

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Аккаунт',
        title: 'Настройки аккаунта',
        subtitle: 'Управляйте темой интерфейса и текущей сессией из одного места.',
        profile: 'Профиль',
        interface: 'Интерфейс',
        currentTheme: 'Текущая тема',
        themeHint: 'Переключение применяется ко всему приложению и сохраняется для следующих запусков.',
        session: 'Сессия',
        logoutTitle: 'Завершить сеанс',
        logoutText: 'Выйти из аккаунта на этом устройстве.',
        name: 'Имя',
        role: 'Роль',
        phone: 'Телефон',
        license: 'Водительское удостоверение',
      }
    : {
        kicker: 'Account',
        title: 'Account settings',
        subtitle: 'Manage the interface theme and the current session from one place.',
        profile: 'Profile',
        interface: 'Interface',
        currentTheme: 'Current theme',
        themeHint: 'The selection applies to the whole app and stays saved for the next launches.',
        session: 'Session',
        logoutTitle: 'End session',
        logoutText: 'Sign out from this account on this device.',
        name: 'Name',
        role: 'Role',
        phone: 'Phone',
        license: 'Driver license',
      },
)

const currentThemeLabel = computed(() =>
  locale.value === 'ru'
    ? uiStore.theme === 'dark'
      ? 'Тёмная'
      : 'Светлая'
    : uiStore.theme === 'dark'
      ? 'Dark'
      : 'Light',
)

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">{{ copy.kicker }}</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <article class="card-base p-6">
        <div class="flex items-center gap-3">
          <div class="rounded-2xl bg-primary/15 p-3 text-primary">
            <UserRound class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-white">{{ copy.profile }}</h2>
            <p class="text-sm text-white/45">{{ authStore.currentAccount?.email }}</p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl bg-white/[0.03] p-4">
            <p class="text-sm text-white/45">{{ copy.name }}</p>
            <p class="mt-2 font-medium text-white">{{ authStore.currentAccount?.fullName }}</p>
          </div>
          <div class="rounded-2xl bg-white/[0.03] p-4">
            <p class="text-sm text-white/45">{{ copy.role }}</p>
            <p class="mt-2 font-medium text-white">{{ authStore.currentAccount ? humanizeEnum(authStore.currentAccount.role) : '—' }}</p>
          </div>
          <div v-if="authStore.currentClientProfile" class="rounded-2xl bg-white/[0.03] p-4">
            <p class="text-sm text-white/45">{{ copy.phone }}</p>
            <p class="mt-2 font-medium text-white">{{ authStore.currentClientProfile.phone }}</p>
          </div>
          <div v-if="authStore.currentClientProfile" class="rounded-2xl bg-white/[0.03] p-4">
            <p class="text-sm text-white/45">{{ copy.license }}</p>
            <p class="mt-2 font-medium text-white">{{ authStore.currentClientProfile.driverLicenseNumber }}</p>
          </div>
        </div>
      </article>

      <div class="grid gap-6">
        <article class="card-base p-6">
          <div class="flex items-center gap-3">
            <div class="rounded-2xl bg-primary/15 p-3 text-primary">
              <component :is="uiStore.theme === 'dark' ? SunMedium : MoonStar" class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">{{ copy.interface }}</h2>
              <p class="text-sm text-white/45">{{ copy.themeHint }}</p>
            </div>
          </div>

          <div class="mt-6 rounded-2xl bg-white/[0.03] p-4">
            <p class="text-sm text-white/45">{{ copy.currentTheme }}</p>
            <p class="mt-2 font-medium text-white">{{ currentThemeLabel }}</p>
          </div>

          <div class="mt-5">
            <ThemeToggle />
          </div>
        </article>

        <article class="card-base p-6">
          <div class="flex items-center gap-3">
            <div class="rounded-2xl bg-primary/15 p-3 text-primary">
              <ShieldCheck class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-white">{{ copy.session }}</h2>
              <p class="text-sm text-white/45">{{ copy.logoutText }}</p>
            </div>
          </div>

          <div class="mt-6 rounded-2xl bg-white/[0.03] p-4">
            <p class="font-medium text-white">{{ copy.logoutTitle }}</p>
            <p class="mt-2 text-sm text-white/45">{{ copy.logoutText }}</p>
          </div>

          <button class="btn-secondary mt-5 w-full justify-center !text-danger" type="button" @click="logout">
            <LogOut class="h-4 w-4" />
            {{ t('nav.logout') }}
          </button>
        </article>
      </div>
    </div>
  </section>
</template>
