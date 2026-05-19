<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MaintenanceFormSection from '@/components/maintenance/MaintenanceFormSection.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/app/stores/cars'
import { useMaintenanceStore } from '@/app/stores/maintenance'
import { useUiStore } from '@/app/stores/ui'
import type { MaintenanceFormModel } from '@/types/entities'

const route = useRoute()
const router = useRouter()
const carsStore = useCarsStore()
const maintenanceStore = useMaintenanceStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const maintenanceId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const isEdit = computed(() => Boolean(maintenanceId.value))
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        title: isEdit.value ? 'Редактирование окна обслуживания' : 'Добавление окна обслуживания',
        subtitle: 'Валидация не позволит наложить обслуживание на существующую аренду автомобиля.',
        saved: isEdit.value ? 'Окно обновлено' : 'Окно обслуживания создано',
        failed: 'Не удалось сохранить окно обслуживания',
      }
    : {
        title: isEdit.value ? 'Edit maintenance window' : 'Add maintenance window',
        subtitle:
          'Validation prevents maintenance from overlapping with an existing rental period for the same vehicle.',
        saved: isEdit.value ? 'Maintenance window updated' : 'Maintenance window created',
        failed: 'Unable to save maintenance window',
      },
)

const form = ref<MaintenanceFormModel>({
  carId: '',
  from: '',
  to: '',
  serviceType: '',
  comment: '',
  status: 'SCHEDULED',
  estimatedCost: null,
})

onMounted(async () => {
  await Promise.all([carsStore.fetchAll(), maintenanceStore.fetchAll()])
  const current = maintenanceId.value ? maintenanceStore.byId(maintenanceId.value) : null
  if (current) {
    form.value = {
      carId: current.carId,
      from: current.from,
      to: current.to,
      serviceType: current.serviceType,
      comment: current.comment,
      status: current.status,
      estimatedCost: current.estimatedCost ?? null,
    }
  }
})

async function submit() {
  try {
    await maintenanceStore.save(maintenanceId.value || null, {
      carId: form.value.carId,
      from: form.value.from,
      to: form.value.to,
      serviceType: form.value.serviceType,
      comment: form.value.comment,
      status: form.value.status,
      estimatedCost: form.value.estimatedCost ?? undefined,
    })
    await carsStore.fetchAll()
    uiStore.pushToast({ type: 'success', title: copy.value.saved })
    router.push('/manager/maintenance')
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.failed,
      message:
        error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  }
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">Maintenance form</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <ErrorState v-if="maintenanceStore.error" :message="maintenanceStore.error" @retry="maintenanceStore.fetchAll" />

    <div v-else class="card-base p-6">
      <MaintenanceFormSection v-model="form" :cars="carsStore.items" />
      <div class="mt-6 flex gap-3">
        <button class="btn-secondary" type="button" @click="router.push('/manager/maintenance')">
          {{ locale === 'ru' ? 'Назад' : 'Back' }}
        </button>
        <button class="btn-primary" type="button" @click="submit">{{ locale === 'ru' ? 'Сохранить' : 'Save' }}</button>
      </div>
    </div>
  </section>
</template>
