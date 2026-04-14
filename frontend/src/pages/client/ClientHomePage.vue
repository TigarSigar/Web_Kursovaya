<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CalendarClock, ShieldCheck, Wrench } from 'lucide-vue-next'
import SearchForm from '@/components/cars/SearchForm.vue'
import CarCard from '@/components/cars/CarCard.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import type { SearchCarsParams } from '@/types/entities'

const carsStore = useCarsStore()
const router = useRouter()
const { locale } = useI18n()

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Клиентская зона',
        title1: 'Путешествуйте',
        title2: 'с уверенностью',
        title3: 'и комфортом',
        subtitle: 'Ищите доступные автомобили, сразу видьте ограничения и бронируйте с прозрачным расчётом стоимости.',
        fleet: 'Автопарк',
        available: 'Доступно сейчас',
        section: 'Популярные автомобили',
        sectionTitle: 'Чаще всего выбирают',
        explore: 'Смотреть каталог',
        c1: 'Контроль периодов',
        c1t: 'Сервис не позволит создать аренду с пересечением по датам.',
        c2: 'Учёт обслуживания',
        c2t: 'Окна ТО автоматически исключают автомобиль из результатов поиска.',
        c3: 'Прозрачная цена',
        c3t: 'Стоимость объясняется как базовая цена плюс тариф за сутки.',
        startSearch: 'Начать поиск',
      }
    : {
        kicker: 'Client area',
        title1: 'Drive with',
        title2: 'Confidence',
        title3: 'and Comfort',
        subtitle: 'Search verified vehicles, see availability rules instantly, and book with transparent pricing built around real rental operations.',
        fleet: 'Fleet size',
        available: 'Available now',
        section: 'Featured fleet',
        sectionTitle: 'Popular vehicles this week',
        explore: 'Explore Cars',
        c1: 'Conflict-free periods',
        c1t: 'Availability checks block overlapping rentals before a booking can be created.',
        c2: 'Maintenance aware',
        c2t: 'Vehicles scheduled for maintenance are automatically excluded from booking results.',
        c3: 'Transparent pricing',
        c3t: 'Every order explains the total as base fee plus daily rate multiplied by rental duration.',
        startSearch: 'Start Search',
      },
)

const locations = computed(() => [...new Set(carsStore.items.map((car) => car.location))])

onMounted(async () => {
  if (carsStore.items.length === 0) {
    await carsStore.fetchAll()
  }
})

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
</script>

<template>
  <section class="relative overflow-hidden rounded-[36px] border border-white/8 bg-[#070710] px-6 py-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)] lg:px-10 lg:py-14">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_34%)]" />
    <div class="hero-pattern absolute inset-0 opacity-40" />

    <div class="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ copy.kicker }}</p>
        <h1 v-if="locale === 'ru'" class="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white lg:text-7xl">
          Путешествуйте <span class="text-primary">уверенно</span><br />
          Выбирайте <span class="text-primary">комфорт</span>.<br />
          Приезжайте стильно
        </h1>
        <h1 v-else class="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-white lg:text-7xl">
          Drive with <span class="text-primary">Confidence</span><br />
          Travel with <span class="text-primary">Comfort</span>.<br />
          Arrive in Style
        </h1>
        <p class="mt-6 max-w-2xl text-lg leading-8 text-white/55">
          {{ copy.subtitle }}
        </p>
      </div>

      <div class="space-y-4">
        <div class="glass-panel rounded-[32px] p-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-[24px] bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.fleet }}</p>
              <p class="mt-2 text-3xl font-semibold text-white">{{ carsStore.items.length }}</p>
            </div>
            <div class="rounded-[24px] bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.available }}</p>
              <p class="mt-2 text-3xl font-semibold text-white">{{ carsStore.items.filter((car) => car.status === 'AVAILABLE').length }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative mt-10">
      <SearchForm :locations="locations" theme="dark" @submit="submitSearch" />
    </div>
  </section>

  <section class="mt-10 grid gap-4 md:grid-cols-3">
    <div class="card-base p-5">
      <CalendarClock class="h-6 w-6 text-primary" />
      <h2 class="mt-4 text-lg font-semibold text-white">{{ copy.c1 }}</h2>
      <p class="mt-2 text-sm leading-7 text-white/55">{{ copy.c1t }}</p>
    </div>
    <div class="card-base p-5">
      <Wrench class="h-6 w-6 text-primary" />
      <h2 class="mt-4 text-lg font-semibold text-white">{{ copy.c2 }}</h2>
      <p class="mt-2 text-sm leading-7 text-white/55">{{ copy.c2t }}</p>
    </div>
    <div class="card-base p-5">
      <ShieldCheck class="h-6 w-6 text-primary" />
      <h2 class="mt-4 text-lg font-semibold text-white">{{ copy.c3 }}</h2>
      <p class="mt-2 text-sm leading-7 text-white/55">{{ copy.c3t }}</p>
    </div>
  </section>

  <section class="mt-10">
    <div class="mb-5 flex items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ copy.section }}</p>
        <h2 class="mt-2 text-3xl font-semibold text-white">{{ copy.sectionTitle }}</h2>
      </div>
      <button class="btn-secondary" type="button" @click="router.push('/client/search')">{{ copy.explore }}</button>
    </div>

    <div class="grid gap-6 xl:grid-cols-3">
      <CarCard
        v-for="car in carsStore.featuredCars"
        :key="car.id"
        :car="car"
        theme="dark"
        :action-label="copy.startSearch"
        :action-to="`/client/search?carClass=${car.carClass}`"
      />
    </div>
  </section>
</template>
