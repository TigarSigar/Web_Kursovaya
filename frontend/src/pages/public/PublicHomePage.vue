<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  Car,
  CalendarCheck2,
  CreditCard,
  Headphones,
  KeyRound,
  MapPin,
  Shield,
  Clock3,
} from 'lucide-vue-next'
import SearchForm from '@/components/cars/SearchForm.vue'
import CarCard from '@/components/cars/CarCard.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import { useUiStore } from '@/store/ui'
import type { SearchCarsParams } from '@/types/entities'

const router = useRouter()
const carsStore = useCarsStore()
const uiStore = useUiStore()
const { locale } = useI18n()
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        titleLine1: 'Путешествуйте',
        titleLine2: 'с уверенностью',
        titleLine3: 'и комфортом',
        subtitle: 'Выбирайте автомобили из широкого каталога, бронируйте онлайн и получайте надёжный сервис без лишних шагов.',
        explore: 'Смотреть автомобили',
        about: 'О сервисе',
        featured: 'Популярные автомобили',
        featuredText: 'Премиальная подборка автомобилей под разные сценарии поездки',
        view: 'Подробнее',
        all: 'Все автомобили',
        how: 'Как это работает',
        howText: 'Аренда автомобиля в несколько простых шагов.',
        howLocationTitle: 'Выберите локацию',
        howLocationText: 'Укажите удобную точку выдачи и возврата автомобиля.',
        howDatesTitle: 'Выберите даты',
        howDatesText: 'Задайте период аренды и сразу проверьте доступность.',
        howCarTitle: 'Выберите автомобиль',
        howCarText: 'Сравните доступные машины и откройте подходящий вариант.',
        howDriveTitle: 'Заберите и поезжайте',
        howDriveText: 'Подтвердите заказ, заберите авто и начните поездку.',
        why: 'Почему CarGO',
        whyText: 'Современный сервис аренды с прозрачными условиями и быстрым бронированием',
        insuranceTitle: 'Полное покрытие',
        insuranceText: 'Автомобили подготовлены к выдаче и сопровождаются прозрачными условиями защиты.',
        supportTitle: 'Поддержка 24/7',
        supportText: 'Команда сервиса помогает с бронированием, выдачей и возвратом в любое время.',
        priceTitle: 'Честная цена',
        priceText: 'Стоимость без скрытых доплат: базовая цена, тариф и понятные ограничения.',
        bookingTitle: 'Быстрое бронирование',
        bookingText: 'Онлайн-оформление занимает несколько минут и сразу показывает результат проверки.',
      }
    : {
        titleLine1: 'Drive with',
        titleLine2: 'Confidence',
        titleLine3: 'and Comfort',
        subtitle: 'Choose from a wide range of cars, book easily online, and enjoy a smooth, reliable driving experience wherever you go.',
        explore: 'Explore Cars',
        about: 'About us',
        featured: 'Featured Vehicles',
        featuredText: 'Discover our premium selection of vehicles for every occasion',
        view: 'View Details',
        all: 'View All Cars',
        how: 'How It Works',
        howText: 'Renting a car has never been easier. Just follow these simple steps.',
        howLocationTitle: 'Choose Location',
        howLocationText: 'Select the pickup and return point that fits your trip.',
        howDatesTitle: 'Pick Dates',
        howDatesText: 'Set the rental period and check live availability instantly.',
        howCarTitle: 'Select Car',
        howCarText: 'Compare available vehicles and open the option that suits you best.',
        howDriveTitle: 'Drive Away',
        howDriveText: 'Confirm the booking, pick up the vehicle, and start your trip.',
        why: 'Why Choose CarGO',
        whyText: 'We provide the best car rental experience with premium service',
        insuranceTitle: 'Full Coverage',
        insuranceText: 'Vehicles are prepared for handover and backed by transparent protection terms.',
        supportTitle: '24/7 Support',
        supportText: 'The service team helps with booking, pickup, and return whenever needed.',
        priceTitle: 'Fair Pricing',
        priceText: 'No hidden charges: base fee, tariff rate, and restrictions are clear upfront.',
        bookingTitle: 'Easy Booking',
        bookingText: 'The online flow takes only minutes and immediately shows the validation result.',
      },
)

const featuredCars = computed(() => carsStore.items.filter((car) => car.status === 'AVAILABLE').slice(0, 4))
const locations = computed(() => [...new Set(carsStore.items.map((car) => car.location))])

onMounted(async () => {
  if (carsStore.items.length === 0) {
    await carsStore.fetchAll()
  }
})

function handleSearch(params: SearchCarsParams) {
  router.push({
    path: '/cars',
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
  <section class="relative overflow-hidden border-b border-white/5">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.22),_transparent_42%)]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.14),_transparent_36%)]" />
    <div class="relative mx-auto max-w-7xl px-4 pb-20 pt-20 lg:px-8 lg:pb-28 lg:pt-28">
      <div class="mx-auto max-w-5xl text-center">
        <h1 class="text-balance text-5xl font-semibold leading-[1.06] text-white md:text-7xl">
          {{ copy.titleLine1 }} <span class="text-primary">{{ copy.titleLine2 }}</span>
          <br />
          {{ locale === 'ru' ? 'Выбирайте' : 'Travel with' }} <span class="text-primary">{{ copy.titleLine3 }}.</span>
          <br />
          {{ locale === 'ru' ? 'Приезжайте стильно' : 'Arrive in Style' }}
        </h1>
        <p class="mx-auto mt-10 max-w-4xl text-xl leading-9 text-white/50">
          {{ copy.subtitle }}
        </p>
      </div>

      <div class="mx-auto mt-16 max-w-6xl">
        <SearchForm :locations="locations" :theme="uiStore.theme" @submit="handleSearch" />
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <RouterLink
          class="inline-flex items-center rounded-2xl bg-gradient-to-r from-primary to-[#8b5cf6] px-7 py-4 text-lg font-semibold text-white shadow-[0_0_32px_rgba(139,92,246,0.32)]"
          to="/cars"
        >
          {{ copy.explore }}
          <ArrowRight class="ml-2 h-5 w-5" />
        </RouterLink>
        <a class="inline-flex items-center rounded-2xl border border-white/10 px-7 py-4 text-lg font-semibold text-white/85 transition hover:bg-white/5" href="#how-it-works">
          {{ copy.about }}
        </a>
      </div>
    </div>
  </section>

  <section class="bg-[#0b0b15] py-20">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="text-center">
        <h2 class="text-4xl font-semibold text-white">{{ copy.featured }}</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-white/45">
          {{ copy.featuredText }}
        </p>
      </div>
      <div class="mt-12 grid gap-6 xl:grid-cols-4">
        <CarCard
          v-for="car in featuredCars"
          :key="car.id"
          :car="car"
          :theme="uiStore.theme"
          :action-label="copy.view"
          :action-to="`/cars?carClass=${car.carClass}`"
        />
      </div>
      <div class="mt-10 text-center">
        <RouterLink class="inline-flex items-center rounded-2xl border border-primary/30 px-6 py-4 text-lg font-semibold text-primary transition hover:bg-primary/10" to="/cars">
          {{ copy.all }}
          <ArrowRight class="ml-2 h-5 w-5" />
        </RouterLink>
      </div>
    </div>
  </section>

  <section id="how-it-works" class="bg-[#05050d] py-20">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="text-center">
        <h2 class="text-4xl font-semibold text-white">{{ copy.how }}</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-white/45">
          {{ copy.howText }}
        </p>
      </div>
      <div class="mt-14 grid gap-8 md:grid-cols-4">
        <div class="text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10">
            <MapPin class="h-8 w-8 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-white">{{ copy.howLocationTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.howLocationText }}</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10">
            <CalendarCheck2 class="h-8 w-8 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-white">{{ copy.howDatesTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.howDatesText }}</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10">
            <Car class="h-8 w-8 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-white">{{ copy.howCarTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.howCarText }}</p>
        </div>
        <div class="text-center">
          <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10">
            <KeyRound class="h-8 w-8 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-white">{{ copy.howDriveTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.howDriveText }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-[#0b0b15] py-20">
    <div class="mx-auto max-w-7xl px-4 lg:px-8">
      <div class="text-center">
        <h2 class="text-4xl font-semibold text-white">{{ copy.why }}</h2>
        <p class="mx-auto mt-4 max-w-2xl text-lg text-white/45">
          {{ copy.whyText }}
        </p>
      </div>
      <div class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div class="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
          <Shield class="h-6 w-6 text-primary" />
          <h3 class="mt-5 text-xl font-semibold text-white">{{ copy.insuranceTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.insuranceText }}</p>
        </div>
        <div class="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
          <Clock3 class="h-6 w-6 text-primary" />
          <h3 class="mt-5 text-xl font-semibold text-white">{{ copy.supportTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.supportText }}</p>
        </div>
        <div class="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
          <CreditCard class="h-6 w-6 text-primary" />
          <h3 class="mt-5 text-xl font-semibold text-white">{{ copy.priceTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.priceText }}</p>
        </div>
        <div class="rounded-[28px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur">
          <Headphones class="h-6 w-6 text-primary" />
          <h3 class="mt-5 text-xl font-semibold text-white">{{ copy.bookingTitle }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/45">{{ copy.bookingText }}</p>
        </div>
      </div>
    </div>
  </section>

</template>
