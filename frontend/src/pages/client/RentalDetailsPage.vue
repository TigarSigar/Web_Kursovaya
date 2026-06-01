<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import PriceBreakdown from '@/components/rentals/PriceBreakdown.vue'
import StatusHistoryTimeline from '@/components/rentals/StatusHistoryTimeline.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useRentalsStore } from '@/store/rentals'
import { useUiStore } from '@/store/ui'
import { formatDate, formatDateTime } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const rentalsStore = useRentalsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const confirmOpen = ref(false)
const selectedImageIndex = ref(0)
const rentalId = computed(() => route.params.id as string)
const rental = computed(() => rentalsStore.currentRental)
const canCancel = computed(() => ['CREATED', 'CONFIRMED'].includes(rental.value?.status ?? ''))
const imageUrls = computed(() =>
  rental.value?.car?.imageUrls?.length ? rental.value.car.imageUrls : rental.value?.car?.imageUrl ? [rental.value.car.imageUrl] : [],
)
const selectedImage = computed(() => imageUrls.value[selectedImageIndex.value] ?? '/car-placeholder.svg')
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
        title: 'Детали аренды',
        subtitle: 'Проверьте статус, даты, автомобиль, расчёт стоимости и историю изменения заказа.',
        period: 'Период аренды',
        photos: 'Фотографии автомобиля',
        actualReturn: 'Фактический возврат',
        pickup: 'Точка выдачи',
        return: 'Точка возврата',
        notRecorded: 'Пока не зафиксирован',
        timeline: 'История статусов',
        client: 'Клиент',
        note: 'Кнопка отмены скрывается автоматически после выдачи автомобиля.',
        back: 'К списку аренд',
        cancel: 'Отменить аренду',
        confirmTitle: 'Подтвердить отмену аренды',
        confirmText: 'Отмена допустима только до перехода в ISSUED. После выдачи действие исчезает из интерфейса.',
        confirmYes: 'Да, отменить',
        cancelled: 'Аренда отменена',
        cancelledMsg: 'История статусов обновлена.',
        failed: 'Не удалось отменить аренду',
      }
    : {
        title: 'Order Overview',
        subtitle: 'Review timing, status, vehicle, pricing logic, and the complete status history of the rental.',
        period: 'Rental period',
        photos: 'Vehicle photos',
        actualReturn: 'Actual return',
        pickup: 'Pickup location',
        return: 'Return location',
        notRecorded: 'Not recorded yet',
        timeline: 'Status timeline',
        client: 'Client profile',
        note: 'Cancellation disappears automatically once the vehicle has been issued, reflecting the backend business rule.',
        back: 'Back to Rentals',
        cancel: 'Cancel Rental',
        confirmTitle: 'Confirm rental cancellation',
        confirmText: 'Cancellation is allowed only before the rental reaches ISSUED. After issue, the action disappears from the interface.',
        confirmYes: 'Yes, cancel',
        cancelled: 'Rental cancelled',
        cancelledMsg: 'Status history was updated successfully.',
        failed: 'Unable to cancel rental',
      },
)

async function loadRental() {
  const item = await rentalsStore.fetchById(rentalId.value)
  if (authStore.currentClientProfile && item.clientId !== authStore.currentClientProfile.id) {
    router.replace('/forbidden')
  }
}

onMounted(loadRental)

watch(rental, () => {
  selectedImageIndex.value = 0
})

async function cancelRental() {
  if (!rental.value || !authStore.currentClientProfile) {
    return
  }

  try {
    await rentalsStore.cancel(rental.value.id)
    await loadRental()
    await rentalsStore.fetchForClient(authStore.currentClientProfile.id)
    uiStore.pushToast({ type: 'success', title: copy.value.cancelled, message: copy.value.cancelledMsg })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.failed,
      message: error instanceof Error ? error.message : 'Unknown error.',
    })
  } finally {
    confirmOpen.value = false
  }
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">Rental details</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <ErrorState v-if="rentalsStore.error" :message="rentalsStore.error" @retry="loadRental" />

    <div v-else-if="rental && breakdown" class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-6">
        <article class="card-base p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ rental.car?.carClass }}</p>
              <h2 class="mt-2 text-2xl font-semibold text-white">{{ rental.car?.make }} {{ rental.car?.model }}</h2>
              <p class="mt-2 text-sm text-white/45">{{ rental.car?.plateNumber }} • {{ rental.car?.location }}</p>
            </div>
            <StatusBadge :status="rental.status" />
          </div>

          <div class="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
            <img :src="selectedImage" alt="" class="h-72 w-full object-cover" />
          </div>
          <div v-if="imageUrls.length > 1" class="mt-4">
            <p class="text-sm text-white/45">{{ copy.photos }}</p>
            <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              <button
                v-for="(imageUrl, index) in imageUrls"
                :key="`${imageUrl}-${index}`"
                class="overflow-hidden rounded-lg border transition"
                :class="selectedImageIndex === index ? 'border-primary' : 'border-white/10'"
                type="button"
                @click="selectedImageIndex = index"
              >
                <img :src="imageUrl" alt="" class="h-24 w-full object-cover" />
              </button>
            </div>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.period }}</p>
              <p class="mt-1 font-medium text-white">{{ formatDate(rental.from) }} - {{ formatDate(rental.to) }}</p>
            </div>
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.actualReturn }}</p>
              <p class="mt-1 font-medium text-white">{{ rental.actualReturnAt ? formatDateTime(rental.actualReturnAt) : copy.notRecorded }}</p>
            </div>
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.pickup }}</p>
              <p class="mt-1 font-medium text-white">{{ rental.pickupLocation }}</p>
            </div>
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.return }}</p>
              <p class="mt-1 font-medium text-white">{{ rental.returnLocation }}</p>
            </div>
          </div>
        </article>

        <article class="card-base p-6">
          <h2 class="text-lg font-semibold text-white">{{ copy.timeline }}</h2>
          <div class="mt-5">
            <StatusHistoryTimeline :items="rental.statusHistory" />
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <PriceBreakdown :breakdown="breakdown" :tariff="rental.tariff">
          <template #badge><StatusBadge :status="rental.status" size="sm" /></template>
        </PriceBreakdown>

        <article class="card-base p-6">
          <h2 class="text-lg font-semibold text-white">{{ copy.client }}</h2>
          <p class="mt-4 font-medium text-white">{{ rental.client?.firstName }} {{ rental.client?.lastName }}</p>
          <p class="mt-2 text-sm text-white/45">{{ rental.client?.email }}</p>
          <p class="mt-1 text-sm text-white/45">{{ rental.client?.phone }}</p>
          <p class="mt-4 text-sm leading-7 text-white/55">{{ copy.note }}</p>
        </article>

        <div class="flex gap-3">
          <button class="btn-secondary flex-1" type="button" @click="router.push('/client/rentals')">{{ copy.back }}</button>
          <button v-if="canCancel" class="btn-primary flex-1 !bg-danger !shadow-none hover:!scale-100" type="button" @click="confirmOpen = true">
            {{ copy.cancel }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="confirmOpen"
      :title="copy.confirmTitle"
      :description="copy.confirmText"
      :confirm-label="copy.confirmYes"
      danger
      @confirm="cancelRental"
    />
  </section>
</template>
