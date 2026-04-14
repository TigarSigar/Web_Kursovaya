<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import CarTable from '@/components/cars/CarTable.vue'
import { useCarsStore } from '@/store/cars'
import { useUiStore } from '@/store/ui'

const router = useRouter()
const carsStore = useCarsStore()
const uiStore = useUiStore()

const query = ref('')
const statusFilter = ref('ALL')
const carToRemove = ref<string | null>(null)

const filteredCars = computed(() =>
  carsStore.items.filter((car) => {
    const byText = [car.make, car.model, car.vin, car.plateNumber].some((value) => value.toLowerCase().includes(query.value.toLowerCase()))
    const byStatus = statusFilter.value === 'ALL' || car.status === statusFilter.value
    return byText && byStatus
  }),
)

onMounted(async () => {
  await carsStore.fetchAll()
})

async function removeCar() {
  if (!carToRemove.value) {
    return
  }

  try {
    await carsStore.remove(carToRemove.value)
    uiStore.pushToast({ type: 'success', title: 'Vehicle removed' })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: 'Unable to remove vehicle',
      message: error instanceof Error ? error.message : 'Unknown error.',
    })
  } finally {
    carToRemove.value = null
  }
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">Cars management</p>
        <h1 class="page-title">Fleet Inventory</h1>
        <p class="page-subtitle">Manage the car catalog, review statuses, and keep the fleet aligned with rental operations.</p>
      </div>
      <button class="btn-primary" type="button" @click="router.push('/manager/cars/new')">Add Vehicle</button>
    </div>

    <div class="card-base p-5">
      <div class="grid gap-4 md:grid-cols-[1fr_220px]">
        <input v-model="query" class="input-base" placeholder="Search by make, model, VIN, or plate number" />
        <select v-model="statusFilter" class="input-base">
          <option value="ALL">All statuses</option>
          <option value="AVAILABLE">AVAILABLE</option>
          <option value="RENTED">RENTED</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>
    </div>

    <div class="mt-6">
      <ErrorState v-if="carsStore.error" :message="carsStore.error" @retry="carsStore.fetchAll" />
      <div v-else-if="filteredCars.length" class="card-base p-5">
        <CarTable :cars="filteredCars" @edit="router.push(`/manager/cars/${$event}/edit`)" @remove="carToRemove = $event" />
      </div>
      <EmptyState
        v-else
        title="No vehicles found"
        description="Add the first car to the fleet or adjust the current filters."
        action-label="Add Vehicle"
        @action="router.push('/manager/cars/new')"
      />
    </div>

    <ConfirmDialog
      :open="Boolean(carToRemove)"
      title="Remove this vehicle?"
      description="Deletion is blocked if the car still has active rentals tied to it."
      confirm-label="Remove"
      danger
      @confirm="removeCar"
      @update:open="!$event ? (carToRemove = null) : null"
    />
  </section>
</template>
