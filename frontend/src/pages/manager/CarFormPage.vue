<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CarFormSection from '@/components/cars/CarFormSection.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import { useUiStore } from '@/store/ui'
import type { CarFormModel } from '@/types/entities'

const route = useRoute()
const router = useRouter()
const carsStore = useCarsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const carId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const isEdit = computed(() => Boolean(carId.value))
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        title: isEdit.value ? 'Редактирование автомобиля' : 'Добавление автомобиля',
        subtitle: 'Форма отделена от API-логики и используется как переиспользуемый section-компонент.',
        saved: isEdit.value ? 'Автомобиль обновлён' : 'Автомобиль создан',
        failed: 'Не удалось сохранить автомобиль',
      }
    : {
        title: isEdit.value ? 'Edit vehicle' : 'Add vehicle',
        subtitle: 'The form is separated from API logic and reused as a dedicated section component.',
        saved: isEdit.value ? 'Vehicle updated' : 'Vehicle created',
        failed: 'Unable to save vehicle',
      },
)

const form = ref<CarFormModel>({
  vin: '',
  plateNumber: '',
  make: '',
  model: '',
  year: 2024,
  carClass: 'ECONOMY',
  status: 'AVAILABLE',
  seats: 5,
  transmission: 'AUTOMATIC',
  fuelType: 'PETROL',
  location: '',
  odometerKm: 0,
  imageUrl: '/car-placeholder.svg',
  notes: '',
})

onMounted(async () => {
  await carsStore.fetchAll()
  const current = carId.value ? carsStore.byId(carId.value) : null
  if (current) {
    form.value = {
      vin: current.vin,
      plateNumber: current.plateNumber,
      make: current.make,
      model: current.model,
      year: current.year,
      carClass: current.carClass,
      status: current.status,
      seats: current.seats,
      transmission: current.transmission,
      fuelType: current.fuelType,
      location: current.location,
      odometerKm: current.odometerKm,
      imageUrl: current.imageUrl ?? '/car-placeholder.svg',
      notes: current.notes ?? '',
    }
  }
})

async function submit() {
  try {
    await carsStore.save(carId.value || null, form.value)
    uiStore.pushToast({ type: 'success', title: copy.value.saved })
    router.push('/manager/cars')
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.failed,
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  }
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">Car form</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <ErrorState v-if="carsStore.error" :message="carsStore.error" @retry="carsStore.fetchAll" />

    <div v-else class="card-base p-6">
      <CarFormSection v-model="form" />
      <div class="mt-6 flex gap-3">
        <button class="btn-secondary" type="button" @click="router.push('/manager/cars')">{{ locale === 'ru' ? 'Назад' : 'Back' }}</button>
        <button class="btn-primary" type="button" @click="submit">{{ locale === 'ru' ? 'Сохранить' : 'Save' }}</button>
      </div>
    </div>
  </section>
</template>
