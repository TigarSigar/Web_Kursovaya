<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import PriceBreakdown from '@/components/rentals/PriceBreakdown.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useCarsStore } from '@/store/cars'
import { useRentalsStore } from '@/store/rentals'
import { useTariffsStore } from '@/store/tariffs'
import { useUiStore } from '@/store/ui'
import { humanizeEnum } from '@/utils/format'
import { calculatePriceBreakdown } from '@/utils/price'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const carsStore = useCarsStore()
const tariffsStore = useTariffsStore()
const rentalsStore = useRentalsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const form = reactive({
  pickupLocation: '',
  returnLocation: '',
  tariffId: '',
})

const rentalDates = reactive({
  from: '',
  to: '',
})

const selectedImageIndex = ref(0)

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Оформление аренды',
        title: 'Подтверждение бронирования',
        subtitle: 'Перед созданием заказа доступность автомобиля проверяется повторно.',
        unavailableTitle: 'Оформление недоступно',
        unavailableText: 'Сначала выберите автомобиль и корректный диапазон дат в поиске.',
        availabilityError: 'Автомобиль недоступен на выбранные даты. Измените период аренды.',
        vehicle: 'Автомобиль',
        params: 'Параметры аренды',
        startDate: 'Дата начала',
        endDate: 'Дата окончания',
        pickup: 'Точка выдачи',
        return: 'Точка возврата',
        tariff: 'Тариф',
        client: 'Клиент',
        fullName: 'ФИО',
        license: 'Водительское удостоверение',
        restrictions: 'Ограничения тарифа',
        minimum: 'Минимум',
        insurance: 'Страховка',
        included: 'включена',
        excluded: 'не включена',
        submit: 'Подтвердить аренду',
        created: 'Аренда создана',
        createdMessage: 'Заказ {id} добавлен в список клиента.',
        failed: 'Не удалось оформить аренду',
        prevPhoto: 'Предыдущее фото',
        nextPhoto: 'Следующее фото',
        selectedPhoto: 'Выбранное фото',
        recalculate: 'Даты можно изменить до подтверждения',
      }
    : {
        kicker: 'Rental creation',
        title: 'Confirm your booking',
        subtitle: 'Vehicle availability is checked again right before the order is created.',
        unavailableTitle: 'Booking unavailable',
        unavailableText: 'Choose a vehicle and valid rental dates in search first.',
        availabilityError: 'Vehicle is unavailable for the selected dates. Adjust the rental period.',
        vehicle: 'Vehicle',
        params: 'Rental details',
        startDate: 'Start date',
        endDate: 'End date',
        pickup: 'Pickup location',
        return: 'Return location',
        tariff: 'Tariff',
        client: 'Client',
        fullName: 'Full name',
        license: 'Driver license',
        restrictions: 'Tariff restrictions',
        minimum: 'Minimum',
        insurance: 'Insurance',
        included: 'included',
        excluded: 'not included',
        submit: 'Confirm rental',
        created: 'Rental created',
        createdMessage: 'Order {id} was added to the client history.',
        failed: 'Unable to create rental',
        prevPhoto: 'Previous photo',
        nextPhoto: 'Next photo',
        selectedPhoto: 'Selected photo',
        recalculate: 'You can adjust dates before confirming',
      },
)

const carId = computed(() => (typeof route.query.carId === 'string' ? route.query.carId : ''))
const selectedCar = computed(() => carsStore.byId(carId.value))
const compatibleTariffs = computed(() => (selectedCar.value ? tariffsStore.byClass(selectedCar.value.carClass) : []))
const selectedTariff = computed(() => compatibleTariffs.value.find((item) => item.id === form.tariffId) ?? compatibleTariffs.value[0] ?? null)
const breakdown = computed(() =>
  selectedTariff.value && rentalDates.from && rentalDates.to
    ? calculatePriceBreakdown(selectedTariff.value, rentalDates.from, rentalDates.to)
    : null,
)
const blockingResult = computed(() => carsStore.searchResults.find((item) => item.car.id === carId.value) ?? null)
const carUnavailable = computed(() => Boolean(blockingResult.value && !blockingResult.value.available))
const imageUrls = computed(() =>
  selectedCar.value?.imageUrls?.length ? selectedCar.value.imageUrls : selectedCar.value?.imageUrl ? [selectedCar.value.imageUrl] : [],
)
const selectedImage = computed(() => imageUrls.value[selectedImageIndex.value] ?? '/car-placeholder.svg')
const canSubmit = computed(
  () =>
    Boolean(
      authStore.currentClientProfile &&
        selectedCar.value &&
        selectedTariff.value &&
        rentalDates.from &&
        rentalDates.to &&
        !carUnavailable.value,
    ),
)

async function refreshAvailability() {
  if (rentalDates.from && rentalDates.to) {
    await carsStore.searchAvailable({ from: rentalDates.from, to: rentalDates.to })
  } else {
    carsStore.searchResults = []
  }
}

async function syncRouteDates() {
  await router.replace({
    path: route.path,
    query: {
      ...route.query,
      from: rentalDates.from || undefined,
      to: rentalDates.to || undefined,
    },
  })
}

function setDefaultFormValues() {
  if (!selectedCar.value) return

  form.pickupLocation = form.pickupLocation || selectedCar.value.location
  form.returnLocation = form.returnLocation || selectedCar.value.location

  if (!compatibleTariffs.value.some((item) => item.id === form.tariffId)) {
    form.tariffId = compatibleTariffs.value[0]?.id ?? ''
  }
}

function showPreviousImage() {
  if (imageUrls.value.length <= 1) return
  selectedImageIndex.value = selectedImageIndex.value === 0 ? imageUrls.value.length - 1 : selectedImageIndex.value - 1
}

function showNextImage() {
  if (imageUrls.value.length <= 1) return
  selectedImageIndex.value = selectedImageIndex.value === imageUrls.value.length - 1 ? 0 : selectedImageIndex.value + 1
}

watch(
  () => [route.query.from, route.query.to],
  ([from, to]) => {
    rentalDates.from = typeof from === 'string' ? from : ''
    rentalDates.to = typeof to === 'string' ? to : ''
  },
  { immediate: true },
)

watch(selectedCar, () => {
  selectedImageIndex.value = 0
  setDefaultFormValues()
})

watch(compatibleTariffs, setDefaultFormValues)

watch(
  () => [rentalDates.from, rentalDates.to],
  async ([from, to], [prevFrom, prevTo]) => {
    if (from === prevFrom && to === prevTo) return
    await syncRouteDates()
    await refreshAvailability()
  },
)

onMounted(async () => {
  await Promise.all([carsStore.fetchAll(), tariffsStore.fetchAll()])
  setDefaultFormValues()
  await refreshAvailability()
})

async function submit() {
  if (!authStore.currentClientProfile || !selectedCar.value || !selectedTariff.value || !rentalDates.from || !rentalDates.to || carUnavailable.value) {
    return
  }

  try {
    const rental = await rentalsStore.create({
      clientId: authStore.currentClientProfile.id,
      carId: selectedCar.value.id,
      tariffId: selectedTariff.value.id,
      from: rentalDates.from,
      to: rentalDates.to,
      pickupLocation: form.pickupLocation,
      returnLocation: form.returnLocation,
    })
    uiStore.pushToast({
      type: 'success',
      title: copy.value.created,
      message: copy.value.createdMessage.replace('{id}', rental.id),
    })
    router.push(`/client/rentals/${rental.id}`)
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
  <section class="rental-create-page">
    <div class="page-header">
      <div>
        <p class="page-kicker">{{ copy.kicker }}</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <ErrorState
      v-if="!selectedCar || !selectedTariff || !rentalDates.from || !rentalDates.to"
      :title="copy.unavailableTitle"
      :message="copy.unavailableText"
      @retry="router.push('/client/search')"
    />

    <div v-else class="rental-create-page__grid">
      <div class="rental-create-page__main">
        <article class="card-base rental-create-page__vehicle-card">
          <p class="rental-create-page__section-title">{{ copy.vehicle }}</p>

          <div class="rental-create-page__gallery">
            <div v-if="imageUrls.length > 1" class="rental-create-page__thumbs">
              <button
                v-for="(imageUrl, index) in imageUrls"
                :key="`${imageUrl}-${index}`"
                class="rental-create-page__thumb"
                :class="{ 'rental-create-page__thumb--active': selectedImageIndex === index }"
                type="button"
                :aria-label="`${copy.selectedPhoto} ${index + 1}`"
                @click="selectedImageIndex = index"
              >
                <img :src="imageUrl" alt="" class="rental-create-page__thumb-image" />
              </button>
            </div>

            <div class="rental-create-page__main-image-wrap">
              <img :src="selectedImage" alt="" class="rental-create-page__main-image" />

              <button
                v-if="imageUrls.length > 1"
                class="rental-create-page__gallery-arrow rental-create-page__gallery-arrow--left"
                type="button"
                :aria-label="copy.prevPhoto"
                @click="showPreviousImage"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>

              <button
                v-if="imageUrls.length > 1"
                class="rental-create-page__gallery-arrow rental-create-page__gallery-arrow--right"
                type="button"
                :aria-label="copy.nextPhoto"
                @click="showNextImage"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
            </div>
          </div>

          <h2 class="rental-create-page__car-title">{{ selectedCar.make }} {{ selectedCar.model }}</h2>
          <p class="rental-create-page__car-meta">{{ selectedCar.plateNumber }} • {{ humanizeEnum(selectedCar.carClass) }} • {{ selectedCar.location }}</p>
        </article>

        <article class="card-base rental-create-page__details-card">
          <div class="rental-create-page__details-header">
            <h2 class="rental-create-page__details-title">{{ copy.params }}</h2>
            <p class="rental-create-page__details-note">{{ copy.recalculate }}</p>
          </div>

          <div v-if="carUnavailable" class="rental-create-page__availability-alert">
            <p>{{ blockingResult?.reasons?.[0] ?? copy.availabilityError }}</p>
          </div>

          <div class="rental-create-page__form-grid">
            <div class="rental-create-page__dates">
              <DateRangePicker v-model:from="rentalDates.from" v-model:to="rentalDates.to" :theme="uiStore.theme" />
            </div>

            <label class="field-group">
              <span class="field-label">{{ copy.pickup }}</span>
              <input v-model="form.pickupLocation" class="input-base" />
            </label>

            <label class="field-group">
              <span class="field-label">{{ copy.return }}</span>
              <input v-model="form.returnLocation" class="input-base" />
            </label>

            <label class="field-group rental-create-page__tariff-field">
              <span class="field-label">{{ copy.tariff }}</span>
              <select v-model="form.tariffId" class="input-base">
                <option v-for="tariff in compatibleTariffs" :key="tariff.id" :value="tariff.id">
                  {{ tariff.name }} • {{ tariff.dailyPrice }} ₽
                </option>
              </select>
            </label>
          </div>
        </article>

        <article class="card-base rental-create-page__client-card">
          <h2 class="rental-create-page__details-title">{{ copy.client }}</h2>
          <div class="rental-create-page__client-grid">
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.fullName }}</p>
              <p class="rental-create-page__info-value">{{ authStore.currentClientProfile?.firstName }} {{ authStore.currentClientProfile?.lastName }}</p>
            </div>
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.license }}</p>
              <p class="rental-create-page__info-value">{{ authStore.currentClientProfile?.driverLicenseNumber }}</p>
            </div>
          </div>
        </article>
      </div>

      <div class="rental-create-page__sidebar">
        <PriceBreakdown v-if="breakdown" :breakdown="breakdown" :tariff="selectedTariff" />

        <article class="card-base rental-create-page__restrictions-card">
          <h2 class="rental-create-page__details-title">{{ copy.restrictions }}</h2>
          <ul class="rental-create-page__restrictions-list">
            <li v-for="restriction in selectedTariff.restrictions" :key="restriction">• {{ restriction }}</li>
            <li>• {{ copy.minimum }} {{ selectedTariff.minimumDays }} {{ locale === 'ru' ? 'суток' : 'days' }}</li>
            <li>• {{ copy.insurance }} {{ selectedTariff.insuranceIncluded ? copy.included : copy.excluded }}</li>
          </ul>
        </article>

        <button class="btn-primary rental-create-page__submit" type="button" :disabled="!canSubmit" @click="submit">
          {{ copy.submit }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.rental-create-page {
  &__grid {
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  }

  &__main,
  &__sidebar {
    display: grid;
    gap: 24px;
  }

  &__vehicle-card,
  &__details-card,
  &__client-card,
  &__restrictions-card {
    padding: 20px;
  }

  &__section-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: rgb(var(--color-primary));
  }

  &__gallery {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 16px;
    margin-top: 16px;
    align-items: stretch;
  }

  &__thumbs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 420px;
    overflow-y: auto;
    padding-right: 2px;
  }

  &__thumb {
    overflow: hidden;
    padding: 0;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    background: var(--surface-glass);
    transition: border-color 0.2s ease, transform 0.2s ease;

    &:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }

    &--active {
      border-color: rgb(var(--color-primary));
      box-shadow: 0 0 0 1px rgba(139, 92, 246, 0.26);
    }
  }

  &__thumb-image {
    display: block;
    width: 100%;
    height: 78px;
    object-fit: cover;
  }

  &__main-image-wrap {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    background: var(--surface-glass);
  }

  &__main-image {
    display: block;
    width: 100%;
    height: 420px;
    object-fit: cover;
  }

  &__gallery-arrow {
    position: absolute;
    top: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    color: white;
    background: rgba(7, 9, 18, 0.62);
    transform: translateY(-50%);
    backdrop-filter: blur(12px);
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.28);
      background: rgba(7, 9, 18, 0.78);
    }

    &--left {
      left: 16px;
    }

    &--right {
      right: 16px;
    }
  }

  &__car-title,
  &__details-title {
    font-size: 20px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }

  &__car-title {
    margin-top: 16px;
  }

  &__car-meta,
  &__details-note,
  &__restrictions-list,
  &__info-label {
    color: var(--text-muted);
  }

  &__car-meta {
    margin-top: 8px;
    font-size: 14px;
  }

  &__details-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__details-note {
    font-size: 14px;
  }

  &__availability-alert {
    margin-top: 16px;
    padding: 14px 16px;
    border: 1px solid rgba(var(--color-danger), 0.24);
    border-radius: 8px;
    background: rgba(var(--color-danger), 0.1);
    color: rgb(var(--color-danger));
    font-size: 14px;
  }

  &__form-grid {
    display: grid;
    gap: 16px;
    margin-top: 20px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__dates,
  &__tariff-field {
    grid-column: 1 / -1;
  }

  &__client-grid {
    display: grid;
    gap: 12px;
    margin-top: 16px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__info-panel {
    padding: 16px;
    border-radius: 8px;
    background: var(--surface-glass);
  }

  &__info-value {
    margin-top: 6px;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__restrictions-list {
    display: grid;
    gap: 8px;
    margin-top: 16px;
    font-size: 14px;
  }

  &__submit {
    width: 100%;
    justify-content: center;
    min-height: 52px;
  }
}

@media (max-width: 1100px) {
  .rental-create-page {
    &__grid {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 768px) {
  .rental-create-page {
    &__gallery {
      grid-template-columns: 1fr;
    }

    &__thumbs {
      order: 2;
      flex-direction: row;
      max-height: none;
      overflow-x: auto;
      overflow-y: hidden;
      padding-bottom: 2px;
    }

    &__thumb {
      min-width: 88px;
    }

    &__main-image {
      height: 300px;
    }

    &__form-grid,
    &__client-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
