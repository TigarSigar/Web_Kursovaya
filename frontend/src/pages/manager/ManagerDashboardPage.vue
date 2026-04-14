<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BadgeRussianRuble, CarFront, ClipboardList, Wrench } from 'lucide-vue-next'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useCarsStore } from '@/store/cars'
import { useMaintenanceStore } from '@/store/maintenance'
import { useRentalsStore } from '@/store/rentals'
import { formatCurrency } from '@/utils/format'

const router = useRouter()
const carsStore = useCarsStore()
const rentalsStore = useRentalsStore()
const maintenanceStore = useMaintenanceStore()

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
        <p class="page-kicker">Fleet manager</p>
        <h1 class="page-title">Operations Dashboard</h1>
        <p class="page-subtitle">Monitor fleet availability, rental processing, maintenance windows, and realized revenue in one place.</p>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div class="card-base p-5"><CarFront class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">Fleet size</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.totalCars }}</p></div>
      <div class="card-base p-5"><ClipboardList class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">Issued rentals</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.activeRentals }}</p></div>
      <div class="card-base p-5"><Wrench class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">Maintenance windows</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.activeMaintenance }}</p></div>
      <div class="card-base p-5"><CarFront class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">Ready to rent</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.availableCars }}</p></div>
      <div class="card-base p-5"><ClipboardList class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">Awaiting action</p><p class="mt-2 text-3xl font-semibold text-white">{{ stats.pendingRentals }}</p></div>
      <div class="card-base p-5"><BadgeRussianRuble class="h-6 w-6 text-primary" /><p class="mt-4 text-sm text-white/45">Completed revenue</p><p class="mt-2 text-3xl font-semibold text-white">{{ formatCurrency(stats.monthlyRevenue) }}</p></div>
    </div>

    <div class="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <article class="card-base p-6">
        <div class="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-white">Recent rentals</h2>
            <p class="mt-1 text-sm text-white/45">Quick access for issuing and completing active orders.</p>
          </div>
          <button class="btn-secondary" type="button" @click="router.push('/manager/rentals')">View All</button>
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
        <h2 class="text-xl font-semibold text-white">Quick actions</h2>
        <div class="mt-5 grid gap-3">
          <button class="btn-primary justify-center" type="button" @click="router.push('/manager/cars/new')">Add vehicle</button>
          <button class="btn-secondary justify-center" type="button" @click="router.push('/manager/tariffs/new')">Create tariff</button>
          <button class="btn-secondary justify-center" type="button" @click="router.push('/manager/maintenance/new')">Schedule maintenance</button>
          <button class="btn-secondary justify-center" type="button" @click="router.push('/manager/rentals')">Process rentals</button>
        </div>
      </article>
    </div>
  </section>
</template>
