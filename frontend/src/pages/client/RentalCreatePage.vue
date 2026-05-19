<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import PriceBreakdown from '@/components/rentals/PriceBreakdown.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'
import DateRangePicker from '@/shared/ui/DateRangePicker.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/app/stores/auth'
import { useCarsStore } from '@/app/stores/cars'
import { useRentalsStore } from '@/app/stores/rentals'
import { useTariffsStore } from '@/app/stores/tariffs'
import { useUiStore } from '@/app/stores/ui'
import { humanizeEnum } from '@/utils/format'
import { calculatePriceBreakdown } from '@/utils/price'
import { getNextGalleryIndex, getPreviousGalleryIndex, resolveImageUrls } from '@/utils/carousel'
import { getRentalCreateCopy } from '@/pages/client/rentalCreateCopy'

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

const copy = computed(() => getRentalCreateCopy(locale.value))

const carId = computed(() => (typeof route.query.carId === 'string' ? route.query.carId : ''))
const selectedCar = computed(() => carsStore.byId(carId.value))
const compatibleTariffs = computed(() => (selectedCar.value ? tariffsStore.byClass(selectedCar.value.carClass) : []))
const selectedTariff = computed(
  () => compatibleTariffs.value.find((item) => item.id === form.tariffId) ?? compatibleTariffs.value[0] ?? null,
)
const breakdown = computed(() =>
  selectedTariff.value && rentalDates.from && rentalDates.to
    ? calculatePriceBreakdown(selectedTariff.value, rentalDates.from, rentalDates.to)
    : null,
)
const blockingResult = computed(() => carsStore.searchResults.find((item) => item.car.id === carId.value) ?? null)
const carUnavailable = computed(() => Boolean(blockingResult.value && !blockingResult.value.available))
const imageUrls = computed(() => resolveImageUrls(selectedCar.value))
const selectedImage = computed(() => imageUrls.value[selectedImageIndex.value] ?? '/car-placeholder.svg')
const canSubmit = computed(() =>
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
  selectedImageIndex.value = getPreviousGalleryIndex(selectedImageIndex.value, imageUrls.value.length)
}

function showNextImage() {
  selectedImageIndex.value = getNextGalleryIndex(selectedImageIndex.value, imageUrls.value.length)
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
  if (
    !authStore.currentClientProfile ||
    !selectedCar.value ||
    !selectedTariff.value ||
    !rentalDates.from ||
    !rentalDates.to ||
    carUnavailable.value
  ) {
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
      message:
        error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
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
              <img
                :src="selectedImage"
                :alt="`${selectedCar.make} ${selectedCar.model}`"
                class="rental-create-page__main-image"
              />

              <button
                v-if="imageUrls.length > 1"
                class="rental-create-page__gallery-arrow rental-create-page__gallery-arrow--left"
                type="button"
                :aria-label="copy.prevPhoto"
                @click="showPreviousImage"
              >
                <ChevronLeft class="h-4 w-4" />
              </button>

              <button
                v-if="imageUrls.length > 1"
                class="rental-create-page__gallery-arrow rental-create-page__gallery-arrow--right"
                type="button"
                :aria-label="copy.nextPhoto"
                @click="showNextImage"
              >
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
          </div>

          <h2 class="rental-create-page__car-title">{{ selectedCar.make }} {{ selectedCar.model }}</h2>
          <p class="rental-create-page__car-meta">
            {{ selectedCar.plateNumber }} • {{ humanizeEnum(selectedCar.carClass) }}
          </p>
        </article>

        <article class="card-base rental-create-page__specs-card">
          <h2 class="rental-create-page__details-title">{{ copy.specs }}</h2>
          <div class="rental-create-page__specs-grid">
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.carClass }}</p>
              <p class="rental-create-page__info-value">{{ humanizeEnum(selectedCar.carClass) }}</p>
            </div>
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.year }}</p>
              <p class="rental-create-page__info-value">{{ selectedCar.year }}</p>
            </div>
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.seats }}</p>
              <p class="rental-create-page__info-value">{{ selectedCar.seats }}</p>
            </div>
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.transmission }}</p>
              <p class="rental-create-page__info-value">{{ humanizeEnum(selectedCar.transmission) }}</p>
            </div>
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.fuel }}</p>
              <p class="rental-create-page__info-value">{{ humanizeEnum(selectedCar.fuelType) }}</p>
            </div>
            <div class="rental-create-page__info-panel">
              <p class="rental-create-page__info-label">{{ copy.location }}</p>
              <p class="rental-create-page__info-value">{{ selectedCar.location }}</p>
            </div>
          </div>
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
              <DateRangePicker v-model:from="rentalDates.from" v-model:to="rentalDates.to" />
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
              <p class="rental-create-page__info-value">
                {{ authStore.currentClientProfile?.firstName }} {{ authStore.currentClientProfile?.lastName }}
              </p>
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
    gap: var(--space-4);
    grid-template-columns: minmax(0, 1.28fr) minmax(20rem, 0.72fr);
  }

  &__main,
  &__sidebar {
    display: grid;
    gap: var(--space-4);
  }

  &__vehicle-card,
  &__specs-card,
  &__details-card,
  &__client-card,
  &__restrictions-card {
    padding: var(--card-padding-lg);
  }

  &__section-title {
    font-size: var(--font-size-xs);
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgb(var(--color-accent));
  }

  &__gallery {
    display: grid;
    grid-template-columns: 64px minmax(0, 1fr);
    gap: var(--space-3);
    margin-top: var(--space-3);
    align-items: stretch;
  }

  &__thumbs {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    max-height: 220px;
    overflow-y: auto;
    padding-right: var(--space-1);
  }

  &__thumb {
    overflow: hidden;
    padding: 0;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--surface-glass);
    transition:
      border-color 0.2s ease,
      transform 0.2s ease;

    &:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }

    &--active {
      border-color: rgb(var(--color-accent));
      box-shadow: 0 0 0 1px rgb(var(--color-accent) / 0.26);
    }
  }

  &__thumb-image {
    display: block;
    width: 100%;
    height: 64px;
    object-fit: cover;
  }

  &__main-image-wrap {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--surface-glass);
  }

  &__main-image {
    display: block;
    width: 100%;
    min-height: 220px;
    aspect-ratio: 16 / 10;
    object-fit: cover;
  }

  &__gallery-arrow {
    position: absolute;
    top: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    color: rgb(var(--color-text-primary));
    background: var(--surface-glass-strong);
    transform: translateY(-50%);
    backdrop-filter: blur(12px);
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      border-color: var(--border-strong);
      background: var(--surface-glass-hover);
    }

    &--left {
      left: var(--space-3);
    }

    &--right {
      right: var(--space-3);
    }
  }

  &__car-title,
  &__details-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: rgb(var(--color-text-primary));
  }

  &__car-meta,
  &__details-note,
  &__restrictions-list,
  &__info-label {
    color: var(--text-muted);
  }

  &__car-meta {
    margin-top: var(--space-2);
    font-size: var(--font-size-xs);
  }

  &__car-title {
    margin-top: var(--space-4);
  }

  &__specs-grid {
    display: grid;
    gap: var(--space-2);
    margin-top: var(--space-3);
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &__details-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
  }

  &__details-note {
    font-size: var(--font-size-xs);
  }

  &__availability-alert {
    margin-top: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border: 1px solid rgb(var(--color-error) / 0.24);
    border-radius: var(--radius-sm);
    background: rgb(var(--color-error) / 0.1);
    color: rgb(var(--color-error));
    font-size: var(--font-size-sm);
  }

  &__form-grid {
    display: grid;
    gap: var(--space-3);
    margin-top: var(--space-3);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__dates,
  &__tariff-field {
    grid-column: 1 / -1;
  }

  &__client-grid {
    display: grid;
    gap: var(--space-2);
    margin-top: var(--space-2);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__info-panel {
    padding: var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--surface-glass);
  }

  &__info-value {
    margin-top: var(--space-1);
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: rgb(var(--color-text-primary));
  }

  &__restrictions-list {
    display: grid;
    gap: var(--space-1);
    margin-top: var(--space-2);
    font-size: var(--font-size-xs);
  }

  &__submit {
    width: 100%;
    justify-content: center;
    min-height: var(--control-height-lg);
  }
}

@media (min-width: 1101px) {
  .rental-create-page {
    &__sidebar {
      position: sticky;
      top: var(--space-4);
      align-self: start;
    }
  }
}

@media (max-width: 1100px) {
  .rental-create-page {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__specs-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
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
      padding-bottom: var(--space-1);
    }

    &__thumb {
      min-width: 64px;
    }

    &__main-image {
      min-height: 200px;
    }

    &__form-grid,
    &__client-grid,
    &__specs-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
