<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import CarTable from '@/components/cars/CarTable.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import { useUiStore } from '@/store/ui'
import { humanizeEnum } from '@/utils/format'

const router = useRouter()
const carsStore = useCarsStore()
const uiStore = useUiStore()
const { locale, t } = useI18n()

const query = ref('')
const statusFilter = ref('ALL')
const carToRemove = ref<string | null>(null)
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Управление авто',
        title: 'Автопарк',
        subtitle: 'Поддерживайте каталог автомобилей, статусы и доступность для арендных сценариев.',
        addVehicle: 'Добавить автомобиль',
        searchPlaceholder: 'Поиск по марке, модели, VIN или номеру',
        allStatuses: 'Все статусы',
        removed: 'Автомобиль удалён',
        removeFailed: 'Не удалось удалить автомобиль',
        unknownError: 'Неизвестная ошибка.',
        emptyTitle: 'Автомобили не найдены',
        emptyDescription: 'Добавьте первый автомобиль в автопарк или измените фильтры.',
        confirmTitle: 'Удалить этот автомобиль?',
        confirmDescription: 'Удаление недоступно, если с автомобилем связаны активные аренды.',
      }
    : {
        kicker: 'Cars management',
        title: 'Fleet Inventory',
        subtitle: 'Manage the car catalog, review statuses, and keep the fleet aligned with rental operations.',
        addVehicle: 'Add vehicle',
        searchPlaceholder: 'Search by make, model, VIN, or plate number',
        allStatuses: 'All statuses',
        removed: 'Vehicle removed',
        removeFailed: 'Unable to remove vehicle',
        unknownError: 'Unknown error.',
        emptyTitle: 'No vehicles found',
        emptyDescription: 'Add the first car to the fleet or adjust the current filters.',
        confirmTitle: 'Remove this vehicle?',
        confirmDescription: 'Deletion is blocked if the car still has active rentals tied to it.',
      },
)

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
    uiStore.pushToast({ type: 'success', title: copy.value.removed })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.removeFailed,
      message: error instanceof Error ? error.message : copy.value.unknownError,
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
        <p class="page-kicker">{{ copy.kicker }}</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
      <button class="btn-primary" type="button" @click="router.push('/manager/cars/new')">{{ copy.addVehicle }}</button>
    </div>

    <div class="card-base p-5">
      <div class="grid gap-4 md:grid-cols-[1fr_220px]">
        <input v-model="query" class="input-base" :placeholder="copy.searchPlaceholder" />
        <select v-model="statusFilter" class="input-base">
          <option value="ALL">{{ copy.allStatuses }}</option>
          <option value="AVAILABLE">{{ humanizeEnum('AVAILABLE') }}</option>
          <option value="RENTED">{{ humanizeEnum('RENTED') }}</option>
          <option value="MAINTENANCE">{{ humanizeEnum('MAINTENANCE') }}</option>
          <option value="INACTIVE">{{ humanizeEnum('INACTIVE') }}</option>
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
        :title="copy.emptyTitle"
        :description="copy.emptyDescription"
        :action-label="copy.addVehicle"
        @action="router.push('/manager/cars/new')"
      />
    </div>

    <ConfirmDialog
      :open="Boolean(carToRemove)"
      :title="copy.confirmTitle"
      :description="copy.confirmDescription"
      :confirm-label="t('common.remove')"
      danger
      @confirm="removeCar"
      @update:open="!$event ? (carToRemove = null) : null"
    />
  </section>
</template>
