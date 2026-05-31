<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CarFormSection from '@/components/cars/CarFormSection.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import { useUiStore } from '@/store/ui'
import type { CarFormModel } from '@/types/entities'
import { isValidRussianPlateNumber, normalizePlateNumberInput } from '@/utils/car-form'

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
        invalidPlate: 'Госномер должен быть в формате: буква, три цифры, две буквы, регион. Например: А123ВС154.',
        invalidLocation: 'Нужно выбрать одну из существующих локаций.',
        missingImage: 'Загрузите хотя бы одно изображение автомобиля файлом с компьютера.',
        invalidImage: 'SVG и ссылки больше не используются. Загрузите JPG, PNG или WEBP файлом.',
      }
    : {
        title: isEdit.value ? 'Edit vehicle' : 'Add vehicle',
        subtitle: 'The form is separated from API logic and reused as a dedicated section component.',
        saved: isEdit.value ? 'Vehicle updated' : 'Vehicle created',
        failed: 'Unable to save vehicle',
        invalidPlate: 'Plate number must match the required format. Example: A123BC154.',
        invalidLocation: 'Choose one of the existing locations.',
        missingImage: 'Upload at least one car image file from your computer.',
        invalidImage: 'SVG and URL-based placeholders are no longer allowed. Upload a JPG, PNG, or WEBP file.',
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
  pricePerDay: 3000,
  imageUrls: [],
  notes: '',
})

const availableMakes = computed(() => [...new Set(carsStore.items.map((car) => car.make).filter(Boolean))].sort((left, right) => left.localeCompare(right)))
const availableModels = computed(() => {
  const normalizedMake = form.value.make.trim().toLowerCase()
  const models = carsStore.items
    .filter((car) => !normalizedMake || car.make.trim().toLowerCase() === normalizedMake)
    .map((car) => car.model)
    .filter(Boolean)

  return [...new Set(models)].sort((left, right) => left.localeCompare(right))
})
const availableLocations = computed(() => [...new Set(carsStore.items.map((car) => car.location).filter(Boolean))].sort((left, right) => left.localeCompare(right)))

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
      pricePerDay: current.pricePerDay ?? 3000,
      imageUrls: (current.imageUrls ?? []).filter((url) => Boolean(url) && !url.endsWith('.svg')),
      notes: current.notes ?? '',
    }
  }
})

async function submit() {
  form.value.plateNumber = normalizePlateNumberInput(form.value.plateNumber)

  if (!isValidRussianPlateNumber(form.value.plateNumber)) {
    uiStore.pushToast({ type: 'error', title: copy.value.failed, message: copy.value.invalidPlate })
    return
  }

  if (!availableLocations.value.includes(form.value.location)) {
    uiStore.pushToast({ type: 'error', title: copy.value.failed, message: copy.value.invalidLocation })
    return
  }

  if (!form.value.imageUrls.length) {
    uiStore.pushToast({ type: 'error', title: copy.value.failed, message: copy.value.missingImage })
    return
  }

  if (form.value.imageUrls.some((url) => url.endsWith('.svg') || url.startsWith('data:image/svg+xml'))) {
    uiStore.pushToast({ type: 'error', title: copy.value.failed, message: copy.value.invalidImage })
    return
  }

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
      <CarFormSection v-model="form" :makes="availableMakes" :models="availableModels" :locations="availableLocations" />
      <div class="mt-6 flex gap-3">
        <button class="btn-secondary" type="button" @click="router.push('/manager/cars')">{{ locale === 'ru' ? 'Назад' : 'Back' }}</button>
        <button class="btn-primary" type="button" @click="submit">{{ locale === 'ru' ? 'Сохранить' : 'Save' }}</button>
      </div>
    </div>
  </section>
</template>
