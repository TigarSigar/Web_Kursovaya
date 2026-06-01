<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BadgeRussianRuble, CarFront, ClipboardList, Wrench } from 'lucide-vue-next'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import { useMaintenanceStore } from '@/store/maintenance'
import { useRentalsStore } from '@/store/rentals'
import { formatCurrency } from '@/utils/format'

const router = useRouter()
const carsStore = useCarsStore()
const rentalsStore = useRentalsStore()
const maintenanceStore = useMaintenanceStore()
const { locale } = useI18n()

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Менеджер автопарка',
        title: 'Операционная панель',
        subtitle: 'Следите за доступностью автопарка, обработкой аренд, окнами обслуживания и подтверждённой выручкой в одном месте.',
        totalCars: 'Размер автопарка',
        activeRentals: 'Выданные аренды',
        activeMaintenance: 'Окна обслуживания',
        availableCars: 'Готово к выдаче',
        pendingRentals: 'Ожидают действия',
        revenue: 'Завершённая выручка',
        recentTitle: 'Последние аренды',
        recentText: 'Быстрый доступ к активным заказам и недавним изменениям.',
        viewAll: 'Смотреть все',
        quickActions: 'Быстрые действия',
        addVehicle: 'Добавить автомобиль',
        createTariff: 'Создать тариф',
        scheduleMaintenance: 'Запланировать обслуживание',
        processRentals: 'Обработать аренды',
      }
    : {
        kicker: 'Fleet manager',
        title: 'Operations Dashboard',
        subtitle: 'Monitor fleet availability, rental processing, maintenance windows, and realized revenue in one place.',
        totalCars: 'Fleet size',
        activeRentals: 'Issued rentals',
        activeMaintenance: 'Maintenance windows',
        availableCars: 'Ready to rent',
        pendingRentals: 'Awaiting action',
        revenue: 'Completed revenue',
        recentTitle: 'Recent rentals',
        recentText: 'Quick access to active orders and recent updates.',
        viewAll: 'View all',
        quickActions: 'Quick actions',
        addVehicle: 'Add vehicle',
        createTariff: 'Create tariff',
        scheduleMaintenance: 'Schedule maintenance',
        processRentals: 'Process rentals',
      },
)

const stats = computed(() => ({
  totalCars: carsStore.items.length,
  availableCars: carsStore.items.filter((car) => car.status === 'AVAILABLE').length,
  activeRentals: rentalsStore.items.filter((rental) => rental.status === 'ISSUED').length,
  pendingRentals: rentalsStore.items.filter((rental) => ['CREATED', 'CONFIRMED'].includes(rental.status)).length,
  activeMaintenance: maintenanceStore.items.filter((window) => ['SCHEDULED', 'IN_PROGRESS'].includes(window.status)).length,
  monthlyRevenue: rentalsStore.items.filter((rental) => rental.status === 'COMPLETED').reduce((sum, rental) => sum + rental.totalPrice, 0),
}))

const recentRentals = computed(() => rentalsStore.items.slice(0, 5))

onMounted(async () => {
  await Promise.all([carsStore.fetchAll(), rentalsStore.fetchAll(), maintenanceStore.fetchAll()])
})
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

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div class="card-base p-5"><CarFront class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">{{ copy.totalCars }}</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.totalCars }}</p></div>
      <div class="card-base p-5"><ClipboardList class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">{{ copy.activeRentals }}</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.activeRentals }}</p></div>
      <div class="card-base p-5"><Wrench class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">{{ copy.activeMaintenance }}</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.activeMaintenance }}</p></div>
      <div class="card-base p-5"><CarFront class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">{{ copy.availableCars }}</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.availableCars }}</p></div>
      <div class="card-base p-5"><ClipboardList class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">{{ copy.pendingRentals }}</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.pendingRentals }}</p></div>
      <div class="card-base p-5"><BadgeRussianRuble class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">{{ copy.revenue }}</p><p class="mt-2 text-3xl font-semibold text-white">{{ formatCurrency(stats.monthlyRevenue) }}</p></div>
    </div>

    <div class="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="card-base p-6">
        <div class="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-white">{{ copy.recentTitle }}</h2>
            <p class="mt-1 text-sm text-white/45">{{ copy.recentText }}</p>
          </div>
          <button class="btn-secondary" type="button" @click="router.push('/manager/rentals')">{{ copy.viewAll }}</button>
        </div>

        <div class="space-y-4">
          <div v-for="rental in recentRentals" :key="rental.id" class="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-medium text-white">{{ rental.car?.make }} {{ rental.car?.model }}</p>
                <p class="text-sm text-white/45">{{ rental.client?.firstName }} {{ rental.client?.lastName }} • {{ rental.id }}</p>
              </div>
              <StatusBadge :status="rental.status" size="sm" />
            </div>
          </div>
        </div>
      </article>

      <article class="card-base p-6">
        <h2 class="text-xl font-semibold text-white">{{ copy.quickActions }}</h2>
        <div class="mt-5 grid gap-3">
          <button class="btn-primary justify-center" type="button" @click="router.push('/manager/cars/new')">{{ copy.addVehicle }}</button>
          <button class="btn-secondary justify-center" type="button" @click="router.push('/manager/tariffs/new')">{{ copy.createTariff }}</button>
          <button class="btn-secondary justify-center" type="button" @click="router.push('/manager/maintenance/new')">{{ copy.scheduleMaintenance }}</button>
          <button class="btn-secondary justify-center" type="button" @click="router.push('/manager/rentals')">{{ copy.processRentals }}</button>
        </div>
      </article>
    </div>
  </section>
</template>
