<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut, ShieldCheck, UserRound, Camera } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { humanizeEnum } from '@/utils/format'
import { ref } from 'vue'

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
        edit: 'Редактировать',
        save: 'Сохранить',
        cancel: 'Отмена',
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
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
      },
)


function logout() {
  authStore.logout()
  router.push('/login')
}

const fileInput = ref<HTMLInputElement | null>(null)

function triggerAvatarUpload() {
  fileInput.value?.click()
}

function onAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = async (e) => {
    const base64 = e.target?.result as string
    if (authStore.currentClientProfile) {
      try {
        await authStore.updateClientProfile({
          avatarBase64: base64
        })
        uiStore.pushToast({ type: 'success', title: locale.value === 'ru' ? 'Аватар обновлен' : 'Avatar updated' })
      } catch (err) {
        uiStore.pushToast({ type: 'error', title: locale.value === 'ru' ? 'Ошибка загрузки аватара' : 'Upload error' })
      }
    }
  }
  reader.readAsDataURL(file)
}

const isEditing = ref(false)
const editForm = ref({ phone: '', driverLicenseNumber: '' })

function startEdit() {
  if (authStore.currentClientProfile) {
    editForm.value = {
      phone: authStore.currentClientProfile.phone || '',
      driverLicenseNumber: authStore.currentClientProfile.driverLicenseNumber || ''
    }
    isEditing.value = true
  }
}

function cancelEdit() {
  isEditing.value = false
}

async function saveEdit() {
  await authStore.updateClientProfile({
    phone: editForm.value.phone,
    driverLicenseNumber: editForm.value.driverLicenseNumber
  })
  isEditing.value = false
  uiStore.pushToast({
    type: 'success',
    title: locale.value === 'ru' ? 'Профиль обновлен' : 'Profile updated'
  })
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
          <div class="relative group">
            <div
              v-if="authStore.currentClientProfile?.avatarBase64"
              class="h-12 w-12 rounded-full overflow-hidden border border-white/10"
            >
              <img :src="authStore.currentClientProfile.avatarBase64" class="h-full w-full object-cover" />
            </div>
            <div v-else class="rounded-2xl bg-primary/15 p-3 text-primary h-12 w-12 flex items-center justify-center">
              <UserRound class="h-5 w-5" />
            </div>

            <button
              v-if="authStore.currentClientProfile"
              class="absolute -bottom-2 -right-2 rounded-full bg-[#11131a] border border-white/10 p-1.5 text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
              @click="triggerAvatarUpload"
            >
              <Camera class="h-3 w-3" />
            </button>
            <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onAvatarChange" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-foreground">{{ copy.profile }}</h2>
            <p class="text-sm text-foreground/45">{{ authStore.currentAccount?.email }}</p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl bg-foreground/[0.03] p-4">
            <p class="text-sm text-foreground/45">{{ copy.name }}</p>
            <p class="mt-2 font-medium text-foreground">{{ authStore.currentAccount?.fullName }}</p>
          </div>
          <div class="rounded-2xl bg-foreground/[0.03] p-4">
            <p class="text-sm text-foreground/45">{{ copy.role }}</p>
            <p class="mt-2 font-medium text-foreground">{{ authStore.currentAccount ? humanizeEnum(authStore.currentAccount.role) : '—' }}</p>
          </div>
          <div v-if="authStore.currentClientProfile" class="rounded-2xl bg-foreground/[0.03] p-4">
            <p class="text-sm text-foreground/45">{{ copy.phone }}</p>
            <input v-if="isEditing" v-model="editForm.phone" class="input-base mt-2" type="text" />
            <p v-else class="mt-2 font-medium text-foreground">{{ authStore.currentClientProfile.phone || '—' }}</p>
          </div>
          <div v-if="authStore.currentClientProfile" class="rounded-2xl bg-foreground/[0.03] p-4">
            <p class="text-sm text-foreground/45">{{ copy.license }}</p>
            <input v-if="isEditing" v-model="editForm.driverLicenseNumber" class="input-base mt-2" type="text" />
            <p v-else class="mt-2 font-medium text-foreground">{{ authStore.currentClientProfile.driverLicenseNumber || '—' }}</p>
          </div>
        </div>
        <div v-if="authStore.currentClientProfile" class="mt-4 flex justify-end gap-3">
          <template v-if="isEditing">
            <button class="btn-secondary" type="button" @click="cancelEdit">{{ copy.cancel }}</button>
            <button class="btn-primary" type="button" @click="saveEdit" :disabled="authStore.loading">{{ copy.save }}</button>
          </template>
          <button v-else class="btn-secondary" type="button" @click="startEdit">{{ copy.edit }}</button>
        </div>
      </article>

      <div class="grid gap-6">

        <article class="card-base p-6">
          <div class="flex items-center gap-3">
            <div class="rounded-2xl bg-primary/15 p-3 text-primary">
              <ShieldCheck class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-foreground">{{ copy.session }}</h2>
              <p class="text-sm text-foreground/45">{{ copy.logoutText }}</p>
            </div>
          </div>

          <div class="mt-6 rounded-2xl bg-foreground/[0.03] p-4">
            <p class="font-medium text-foreground">{{ copy.logoutTitle }}</p>
            <p class="mt-2 text-sm text-foreground/45">{{ copy.logoutText }}</p>
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
