<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { useI18n } from '@/i18n'
import { useMaintenanceStore } from '@/store/maintenance'
import { useUiStore } from '@/store/ui'
import { formatCurrency } from '@/utils/format'
import { formatDate } from '@/utils/date'

const router = useRouter()
const maintenanceStore = useMaintenanceStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const filter = ref('ALL')
const itemToRemove = ref<string | null>(null)

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        title: 'Окна обслуживания',
        subtitle: 'Они влияют на доступность автомобилей в клиентском поиске и блокируют оформление аренды.',
        add: 'Добавить окно',
        all: 'Все',
        empty: 'Окна обслуживания не созданы',
        emptyText: 'Добавьте график сервисных работ, чтобы клиентский поиск корректно учитывал недоступность автомобилей.',
        create: 'Создать окно',
        removed: 'Окно обслуживания удалено',
        failed: 'Не удалось удалить окно обслуживания',
        confirmTitle: 'Удалить окно обслуживания?',
        confirmText: 'Удаление запрещено для обслуживания в статусе IN_PROGRESS.',
      }
    : {
        title: 'Maintenance windows',
        subtitle: 'They affect vehicle availability in client search and block rental creation when needed.',
        add: 'Add window',
        all: 'All',
        empty: 'No maintenance windows created',
        emptyText: 'Add a service schedule so client search can correctly exclude unavailable vehicles.',
        create: 'Create window',
        removed: 'Maintenance window removed',
        failed: 'Unable to remove maintenance window',
        confirmTitle: 'Remove maintenance window?',
        confirmText: 'Deletion is blocked for maintenance entries in IN_PROGRESS status.',
      },
)

const filteredItems = computed(() =>
  maintenanceStore.items.filter((item) => filter.value === 'ALL' || item.status === filter.value),
)

onMounted(async () => {
  await maintenanceStore.fetchAll()
})

async function removeItem() {
  if (!itemToRemove.value) {
    return
  }
  try {
    await maintenanceStore.remove(itemToRemove.value)
    uiStore.pushToast({ type: 'success', title: copy.value.removed })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.failed,
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  } finally {
    itemToRemove.value = null
  }
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">Maintenance windows</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
      <button class="btn-primary" type="button" @click="router.push('/manager/maintenance/new')">{{ copy.add }}</button>
    </div>

    <div class="card-base p-5">
      <div class="flex flex-wrap gap-2">
        <button class="chip" :class="{ 'chip-active': filter === 'ALL' }" type="button" @click="filter = 'ALL'">{{ copy.all }}</button>
        <button class="chip" :class="{ 'chip-active': filter === 'SCHEDULED' }" type="button" @click="filter = 'SCHEDULED'">SCHEDULED</button>
        <button class="chip" :class="{ 'chip-active': filter === 'IN_PROGRESS' }" type="button" @click="filter = 'IN_PROGRESS'">IN_PROGRESS</button>
        <button class="chip" :class="{ 'chip-active': filter === 'COMPLETED' }" type="button" @click="filter = 'COMPLETED'">COMPLETED</button>
      </div>
    </div>

    <ErrorState v-if="maintenanceStore.error" class="mt-6" :message="maintenanceStore.error" @retry="maintenanceStore.fetchAll" />

    <div v-else-if="filteredItems.length" class="mt-6 grid gap-4">
      <article v-for="item in filteredItems" :key="item.id" class="card-base p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold text-foreground">{{ item.car?.make }} {{ item.car?.model }}</h2>
            <p class="mt-1 text-sm text-muted-foreground">{{ item.serviceType }} • {{ item.car?.plateNumber }}</p>
          </div>
          <StatusBadge :status="item.status" size="sm" />
        </div>
        <div class="mt-4 grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">{{ locale === 'ru' ? 'Период' : 'Period' }}: <span class="font-medium text-foreground">{{ formatDate(item.from) }} - {{ formatDate(item.to) }}</span></div>
          <div class="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">{{ locale === 'ru' ? 'Стоимость' : 'Cost' }}: <span class="font-medium text-foreground">{{ item.estimatedCost ? formatCurrency(item.estimatedCost) : locale === 'ru' ? 'не указана' : 'not specified' }}</span></div>
          <div class="rounded-2xl bg-white/[0.03] p-4 text-sm text-muted-foreground">{{ locale === 'ru' ? 'Локация' : 'Location' }}: <span class="font-medium text-foreground">{{ item.car?.location }}</span></div>
        </div>
        <p class="mt-4 text-sm text-muted-foreground">{{ item.comment }}</p>
        <div class="mt-5 flex gap-3">
          <button class="btn-secondary flex-1" type="button" @click="router.push(`/manager/maintenance/${item.id}/edit`)">{{ locale === 'ru' ? 'Редактировать' : 'Edit' }}</button>
          <button class="btn-secondary flex-1 !text-danger" type="button" @click="itemToRemove = item.id">{{ locale === 'ru' ? 'Удалить' : 'Remove' }}</button>
        </div>
      </article>
    </div>

    <EmptyState
      v-else
      class="mt-6"
      :title="copy.empty"
      :description="copy.emptyText"
      :action-label="copy.create"
      @action="router.push('/manager/maintenance/new')"
    />

    <ConfirmDialog
      :open="Boolean(itemToRemove)"
      :title="copy.confirmTitle"
      :description="copy.confirmText"
      :confirm-label="locale === 'ru' ? 'Удалить' : 'Remove'"
      danger
      @confirm="removeItem"
      @update:open="!$event ? (itemToRemove = null) : null"
    />
  </section>
</template>
