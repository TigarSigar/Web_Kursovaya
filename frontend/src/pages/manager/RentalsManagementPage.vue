<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import RentalTable from '@/components/rentals/RentalTable.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import { useRentalsStore } from '@/store/rentals'
import { useUiStore } from '@/store/ui'
import { humanizeEnum } from '@/utils/format'

const router = useRouter()
const rentalsStore = useRentalsStore()
const carsStore = useCarsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const query = ref('')
const status = ref('ALL')
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Аренды',
        title: 'Обработка аренд',
        subtitle: 'Менеджер переводит аренду в статусы ISSUED и COMPLETED без нарушения бизнес-правил.',
        placeholder: 'Поиск по заказу, клиенту или автомобилю',
        all: 'Все статусы',
        none: 'Подходящих аренд нет',
        noneText: 'Измените фильтр или дождитесь новых заказов от клиента.',
        issued: 'Автомобиль выдан',
        issueFailed: 'Не удалось перевести аренду в ISSUED',
        completed: 'Аренда завершена',
        completeFailed: 'Не удалось завершить аренду',
      }
    : {
        kicker: 'Rentals',
        title: 'Rental processing',
        subtitle: 'The manager moves rentals to ISSUED and COMPLETED without violating business rules.',
        placeholder: 'Search by order, client, or vehicle',
        all: 'All statuses',
        none: 'No matching rentals',
        noneText: 'Change the filter or wait for new client orders.',
        issued: 'Vehicle issued',
        issueFailed: 'Unable to move rental to ISSUED',
        completed: 'Rental completed',
        completeFailed: 'Unable to complete rental',
      },
)

const filtered = computed(() =>
  rentalsStore.items.filter((rental) => {
    const byStatus = status.value === 'ALL' || rental.status === status.value
    const q = query.value.toLowerCase()
    const byText =
      !q ||
      [rental.id, rental.car?.make, rental.car?.model, rental.client?.firstName, rental.client?.lastName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    return byStatus && byText
  }),
)

onMounted(async () => {
  await Promise.all([rentalsStore.fetchAll(), carsStore.fetchAll()])
})

async function issueRental(rentalId: string) {
  try {
    await rentalsStore.issue(rentalId)
    await Promise.all([rentalsStore.fetchAll(), carsStore.fetchAll()])
    uiStore.pushToast({ type: 'success', title: copy.value.issued })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.issueFailed,
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  }
}

async function completeRental(rentalId: string) {
  try {
    await rentalsStore.complete(rentalId)
    await Promise.all([rentalsStore.fetchAll(), carsStore.fetchAll()])
    uiStore.pushToast({ type: 'success', title: copy.value.completed })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.completeFailed,
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
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
    </div>

    <div class="card-base p-5">
      <div class="grid gap-4 md:grid-cols-[1fr_220px]">
        <input v-model="query" class="input-base" :placeholder="copy.placeholder" />
        <select v-model="status" class="input-base">
          <option value="ALL">{{ copy.all }}</option>
          <option value="CREATED">{{ humanizeEnum('CREATED') }}</option>
          <option value="CONFIRMED">{{ humanizeEnum('CONFIRMED') }}</option>
          <option value="ISSUED">{{ humanizeEnum('ISSUED') }}</option>
          <option value="COMPLETED">{{ humanizeEnum('COMPLETED') }}</option>
          <option value="CANCELLED">{{ humanizeEnum('CANCELLED') }}</option>
        </select>
      </div>
    </div>

    <ErrorState v-if="rentalsStore.error" class="mt-6" :message="rentalsStore.error" @retry="rentalsStore.fetchAll" />
    <div v-else-if="filtered.length" class="mt-6 card-base p-5">
      <RentalTable :rentals="filtered" @open="router.push(`/manager/rentals/${$event}`)" @issue="issueRental" @complete="completeRental" />
    </div>
    <EmptyState
      v-else
      class="mt-6"
      :title="copy.none"
      :description="copy.noneText"
    />
  </section>
</template>
