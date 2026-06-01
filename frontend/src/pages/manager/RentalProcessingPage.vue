<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ErrorState from '@/components/common/ErrorState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriceBreakdown from '@/components/rentals/PriceBreakdown.vue'
import StatusHistoryTimeline from '@/components/rentals/StatusHistoryTimeline.vue'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import { useRentalsStore } from '@/store/rentals'
import { useUiStore } from '@/store/ui'
import { formatDate, formatDateTime } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const rentalsStore = useRentalsStore()
const carsStore = useCarsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const rentalId = computed(() => route.params.id as string)
const rental = computed(() => rentalsStore.currentRental)
const breakdown = computed(() =>
  rental.value
    ? {
        basePrice: rental.value.basePrice,
        dailyPrice: rental.value.dailyPrice,
        totalDays: rental.value.totalDays,
        dailySubtotal: rental.value.dailyPrice * rental.value.totalDays,
        totalPrice: rental.value.totalPrice,
      }
    : null,
)
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        title: 'Обработка заказа',
        subtitle: 'Здесь менеджер принимает решение по выдаче и завершению аренды.',
        period: 'Период',
        tariff: 'Тариф',
        pickup: 'Выдача',
        return: 'Возврат',
        actualReturn: 'Фактическое время возврата',
        timeline: 'История статусов',
        actions: 'Доступные действия',
        issue: 'Перевести в ISSUED',
        complete: 'Перевести в COMPLETED',
        note: 'Если аренда уже выдана, отмена недоступна. После завершения фиксируется фактическое время возврата.',
        back: 'Назад к списку',
        issued: 'Статус обновлён до ISSUED',
        issueFailed: 'Не удалось выдать автомобиль',
        completed: 'Аренда завершена, время возврата зафиксировано',
        completeFailed: 'Не удалось завершить аренду',
      }
    : {
        title: 'Process rental order',
        subtitle: 'This is where the manager handles issue and completion decisions for the rental.',
        period: 'Period',
        tariff: 'Tariff',
        pickup: 'Pickup',
        return: 'Return',
        actualReturn: 'Actual return time',
        timeline: 'Status history',
        actions: 'Available actions',
        issue: 'Move to ISSUED',
        complete: 'Move to COMPLETED',
        note: 'Once a rental has been issued, cancellation is no longer available. Completion records the actual return time.',
        back: 'Back to list',
        issued: 'Status updated to ISSUED',
        issueFailed: 'Unable to issue vehicle',
        completed: 'Rental completed and return time recorded',
        completeFailed: 'Unable to complete rental',
      },
)

async function loadRental() {
  await rentalsStore.fetchById(rentalId.value)
}

onMounted(loadRental)

async function issueRental() {
  if (!rental.value) return
  try {
    await rentalsStore.issue(rental.value.id)
    await Promise.all([loadRental(), carsStore.fetchAll()])
    uiStore.pushToast({ type: 'success', title: copy.value.issued })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.issueFailed,
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  }
}

async function completeRental() {
  if (!rental.value) return
  try {
    await rentalsStore.complete(rental.value.id)
    await Promise.all([loadRental(), carsStore.fetchAll()])
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
        <p class="page-kicker">Rental processing</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <ErrorState v-if="rentalsStore.error" :message="rentalsStore.error" @retry="loadRental" />

    <div v-else-if="rental && breakdown" class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-6">
        <article class="card-base p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ locale === 'ru' ? 'Заказ' : 'Order' }} {{ rental.id }}</p>
              <h2 class="mt-2 text-2xl font-semibold text-foreground">{{ rental.car?.make }} {{ rental.car?.model }}</h2>
              <p class="mt-2 text-sm text-muted-foreground">{{ rental.client?.firstName }} {{ rental.client?.lastName }} • {{ rental.client?.email }}</p>
            </div>
            <StatusBadge :status="rental.status" />
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">{{ copy.period }}: <span class="font-medium text-foreground">{{ formatDate(rental.from) }} - {{ formatDate(rental.to) }}</span></div>
            <div class="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">{{ copy.tariff }}: <span class="font-medium text-foreground">{{ rental.tariff?.name }}</span></div>
            <div class="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">{{ copy.pickup }}: <span class="font-medium text-foreground">{{ rental.pickupLocation }}</span></div>
            <div class="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">{{ copy.return }}: <span class="font-medium text-foreground">{{ rental.returnLocation }}</span></div>
          </div>

          <div v-if="rental.actualReturnAt" class="mt-4 rounded-2xl border border-success/20 bg-success/5 p-4 text-sm">
            <p class="font-medium text-foreground">{{ copy.actualReturn }}</p>
            <p class="mt-1 text-muted-foreground">{{ formatDateTime(rental.actualReturnAt) }}</p>
          </div>
        </article>

        <article class="card-base p-6">
          <h2 class="text-lg font-semibold text-foreground">{{ copy.timeline }}</h2>
          <div class="mt-5">
            <StatusHistoryTimeline :items="rental.statusHistory" />
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <PriceBreakdown :breakdown="breakdown" :tariff="rental.tariff" />

        <article class="card-base p-6">
          <h2 class="text-lg font-semibold text-foreground">{{ copy.actions }}</h2>
          <div class="mt-4 space-y-3">
            <button
              class="btn-primary w-full justify-center"
              :disabled="!['CREATED', 'CONFIRMED'].includes(rental.status)"
              type="button"
              @click="issueRental"
            >
              {{ copy.issue }}
            </button>
            <button
              class="btn-secondary w-full justify-center"
              :disabled="rental.status !== 'ISSUED'"
              type="button"
              @click="completeRental"
            >
              {{ copy.complete }}
            </button>
          </div>
          <p class="mt-4 text-sm text-muted-foreground">
            {{ copy.note }}
          </p>
        </article>

        <button class="btn-secondary w-full justify-center" type="button" @click="router.push('/manager/rentals')">{{ copy.back }}</button>
      </div>
    </div>
  </section>
</template>
