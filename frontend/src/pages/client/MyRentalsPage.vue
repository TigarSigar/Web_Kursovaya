<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ClipboardList } from 'lucide-vue-next'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import RentalCard from '@/components/rentals/RentalCard.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useRentalsStore } from '@/store/rentals'
import { useUiStore } from '@/store/ui'

const authStore = useAuthStore()
const rentalsStore = useRentalsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const activeTab = ref<'all' | 'active' | 'history'>('all')
const confirmOpen = ref(false)
const rentalToCancel = ref<string | null>(null)
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        title: 'Мои аренды',
        subtitle: 'Следите за статусами заказов и отменяйте аренду только до фактической выдачи автомобиля.',
        none: 'Аренд пока нет',
        noneText: 'После оформления заказа здесь появятся статусы, стоимость и история.',
        search: 'Искать автомобили',
        cancelTitle: 'Отменить аренду?',
        cancelText: 'Отмена разрешена только до выдачи автомобиля. После статуса ISSUED действие станет недоступно.',
        cancelButton: 'Отменить аренду',
        cancelled: 'Аренда отменена',
        cancelledMsg: 'История заказа обновлена.',
        failed: 'Отмена недоступна',
      }
    : {
        title: 'My Rentals',
        subtitle: 'Track every order, see current status, and cancel only before the vehicle has been issued.',
        none: 'No rentals yet',
        noneText: 'Once a booking is created, you will see the rental status, price, and timeline here.',
        search: 'Search Cars',
        cancelTitle: 'Cancel this rental?',
        cancelText: 'Cancellation is allowed only before the vehicle is issued. Once the rental reaches ISSUED, this action is no longer available.',
        cancelButton: 'Cancel Rental',
        cancelled: 'Rental cancelled',
        cancelledMsg: 'The order history was updated successfully.',
        failed: 'Cancellation unavailable',
      },
)

const filteredRentals = computed(() => {
  const source = rentalsStore.clientItems

  if (activeTab.value === 'active') {
    return source.filter((rental) => ['CREATED', 'CONFIRMED', 'ISSUED'].includes(rental.status))
  }

  if (activeTab.value === 'history') {
    return source.filter((rental) => ['COMPLETED', 'CANCELLED'].includes(rental.status))
  }

  return source
})

onMounted(async () => {
  if (authStore.currentClientProfile) {
    await rentalsStore.fetchForClient(authStore.currentClientProfile.id)
  }
})

function askCancel(rentalId: string) {
  rentalToCancel.value = rentalId
  confirmOpen.value = true
}

async function confirmCancel() {
  if (!rentalToCancel.value || !authStore.currentClientProfile) {
    return
  }

  try {
    await rentalsStore.cancel(rentalToCancel.value)
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
    rentalToCancel.value = null
  }
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">Client rentals</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <div class="mb-6 flex flex-wrap gap-2">
      <button class="chip" :class="{ 'chip-active': activeTab === 'all' }" type="button" @click="activeTab = 'all'">All</button>
      <button class="chip" :class="{ 'chip-active': activeTab === 'active' }" type="button" @click="activeTab = 'active'">Active</button>
      <button class="chip" :class="{ 'chip-active': activeTab === 'history' }" type="button" @click="activeTab = 'history'">History</button>
    </div>

    <ErrorState v-if="rentalsStore.error" :message="rentalsStore.error" @retry="authStore.currentClientProfile && rentalsStore.fetchForClient(authStore.currentClientProfile.id)" />

    <div v-else-if="filteredRentals.length" class="space-y-4">
      <RentalCard
        v-for="rental in filteredRentals"
        :key="rental.id"
        :rental="rental"
        :details-to="`/client/rentals/${rental.id}`"
        :show-cancel="['CREATED', 'CONFIRMED'].includes(rental.status)"
        @cancel="askCancel"
      />
    </div>

    <EmptyState
      v-else
      :title="copy.none"
      :description="copy.noneText"
      :action-label="copy.search"
      @action="$router.push('/client/search')"
    >
      <template #icon><ClipboardList class="h-8 w-8" /></template>
    </EmptyState>

    <ConfirmDialog
      v-model:open="confirmOpen"
      :title="copy.cancelTitle"
      :description="copy.cancelText"
      :confirm-label="copy.cancelButton"
      danger
      @confirm="confirmCancel"
    />
  </section>
</template>
