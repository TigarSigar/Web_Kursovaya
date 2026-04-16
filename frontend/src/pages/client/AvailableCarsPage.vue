<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CarFront } from 'lucide-vue-next'
import CarCard from '@/components/cars/CarCard.vue'
import SearchForm from '@/components/cars/SearchForm.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useCarsStore } from '@/store/cars'
import { useUiStore } from '@/store/ui'
import type { SearchCarsParams, CarClass } from '@/types/entities'

const carsStore = useCarsStore()
const authStore = useAuthStore()
const uiStore = useUiStore()
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Результаты поиска',
        title: 'Доступные автомобили',
        subtitle: 'Результаты учитывают пересечения аренд и окна обслуживания ещё до оформления заказа.',
        selectPeriod: 'Сначала выберите период аренды',
        selectPeriodText: 'Даты нужны для проверки конфликтов бронирования и ограничений по обслуживанию.',
        ready: 'Можно бронировать',
        unavailable: 'Недоступно на выбранные даты',
        vehicles: 'авто',
        noCars: 'Свободных автомобилей не найдено',
        noCarsText: 'Попробуйте изменить даты или точку выдачи.',
        book: 'Оформить аренду',
        signIn: 'Войти для бронирования',
      }
    : {
        kicker: 'Search results',
        title: 'Available Cars',
        subtitle: 'Results are checked against rental overlaps and maintenance windows before booking is allowed.',
        selectPeriod: 'Select your rental period first',
        selectPeriodText: 'Dates are required to check booking conflicts and maintenance restrictions.',
        ready: 'Ready to book',
        unavailable: 'Unavailable right now',
        vehicles: 'vehicles',
        noCars: 'No cars available',
        noCarsText: 'Try adjusting the dates or pickup location to see more options.',
        book: 'Book Now',
        signIn: 'Sign In to Book',
      },
)

const locations = computed(() => [...new Set(carsStore.items.map((car) => car.location))])
const searchParams = computed<SearchCarsParams>(() => ({
  from: typeof route.query.from === 'string' ? route.query.from : '',
  to: typeof route.query.to === 'string' ? route.query.to : '',
  location: typeof route.query.location === 'string' ? route.query.location : '',
  carClass: typeof route.query.carClass === 'string' ? (route.query.carClass as CarClass) : '',
}))

const available = computed(() => carsStore.searchResults.filter((item) => item.available))
const unavailable = computed(() => carsStore.searchResults.filter((item) => !item.available))

async function runSearch() {
  if (carsStore.items.length === 0) {
    await carsStore.fetchAll()
  }

  if (searchParams.value.from && searchParams.value.to) {
    await carsStore.searchAvailable(searchParams.value)
  } else {
    carsStore.searchResults = []
  }
}

function submitSearch(params: SearchCarsParams) {
  router.push({
    path: '/client/search',
    query: {
      from: params.from,
      to: params.to,
      ...(params.location ? { location: params.location } : {}),
      ...(params.carClass ? { carClass: params.carClass } : {}),
    },
  })
}

function buildRentalLink(carId: string): string {
  const query = new URLSearchParams({
    carId,
    from: searchParams.value.from,
    to: searchParams.value.to,
  })

  if (!authStore.isAuthenticated) {
    return `/login?redirect=${encodeURIComponent(`/client/rentals/new?${query.toString()}`)}`
  }

  return `/client/rentals/new?${query.toString()}`
}

onMounted(runSearch)
watch(() => route.fullPath, runSearch)
</script>

<template>
  <section class="available-cars-page mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
    <div class="page-header">
      <div>
        <p class="page-kicker">{{ copy.kicker }}</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <SearchForm :initial="searchParams" :locations="locations" compact :theme="uiStore.theme" @submit="submitSearch" />

    <div class="mt-8">
      <ErrorState v-if="carsStore.error" :message="carsStore.error" @retry="runSearch" />

      <template v-else-if="!searchParams.from || !searchParams.to">
        <EmptyState
          :title="copy.selectPeriod"
          :description="copy.selectPeriodText"
        >
          <template #icon><CarFront class="h-8 w-8" /></template>
        </EmptyState>
      </template>

      <template v-else>
        <section class="available-cars-page__section">
          <div class="available-cars-page__section-header">
            <h2 class="available-cars-page__section-title">{{ copy.ready }}</h2>
            <p class="available-cars-page__section-count">{{ available.length }} {{ copy.vehicles }}</p>
          </div>
          <div v-if="available.length" class="grid gap-6 xl:grid-cols-2">
            <CarCard
              v-for="item in available"
              :key="item.car.id"
              :car="item.car"
              :result="item"
              :theme="uiStore.theme"
              :action-label="authStore.isAuthenticated ? copy.book : copy.signIn"
              :action-to="buildRentalLink(item.car.id)"
            />
          </div>
          <EmptyState
            v-else
            :title="copy.noCars"
            :description="copy.noCarsText"
          >
            <template #icon><CarFront class="h-8 w-8" /></template>
          </EmptyState>
        </section>

        <section class="available-cars-page__section mt-10">
          <div class="available-cars-page__section-header">
            <h2 class="available-cars-page__section-title">{{ copy.unavailable }}</h2>
            <p class="available-cars-page__section-count">{{ unavailable.length }} {{ copy.vehicles }}</p>
          </div>
          <div v-if="unavailable.length" class="grid gap-6 xl:grid-cols-2">
            <CarCard v-for="item in unavailable" :key="item.car.id" :car="item.car" :result="item" :theme="uiStore.theme" />
          </div>
        </section>
      </template>
    </div>
  </section>
</template>

<style scoped lang="scss">
.available-cars-page {
  &__section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  &__section-title {
    font-size: 20px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }

  &__section-count {
    font-size: 14px;
    color: var(--text-muted);
  }
}
</style>
