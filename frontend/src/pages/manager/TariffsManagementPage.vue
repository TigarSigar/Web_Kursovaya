<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/shared/ui/ConfirmDialog.vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'
import { useI18n } from '@/i18n'
import { useTariffsStore } from '@/app/stores/tariffs'
import { useUiStore } from '@/app/stores/ui'
import { formatCurrency, humanizeEnum } from '@/utils/format'

const router = useRouter()
const tariffsStore = useTariffsStore()
const uiStore = useUiStore()
const tariffToRemove = ref<string | null>(null)
const { locale, t } = useI18n()

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Тарифы',
        title: 'Управление тарифами',
        subtitle: 'Тарифы используются при расчёте стоимости аренды и должны быть понятны клиенту.',
        add: 'Добавить тариф',
        created: 'Тариф удалён',
        failed: 'Не удалось удалить тариф',
        empty: 'Тарифов пока нет',
        emptyText: 'Добавьте хотя бы один тариф, чтобы клиент видел расчёт стоимости аренды.',
        create: 'Создать тариф',
        confirmTitle: 'Удалить тариф?',
        confirmText: 'Тариф нельзя удалить, если он участвует в активных арендах.',
      }
    : {
        kicker: 'Tariffs',
        title: 'Tariff management',
        subtitle: 'Tariffs are used in rental pricing and should stay clear and explainable for clients.',
        add: 'Add tariff',
        created: 'Tariff removed',
        failed: 'Unable to remove tariff',
        empty: 'No tariffs yet',
        emptyText: 'Create at least one tariff so the client can see an explainable rental price.',
        create: 'Create tariff',
        confirmTitle: 'Remove tariff?',
        confirmText: 'A tariff cannot be deleted if it is used by active rentals.',
      },
)

const grouped = computed(() => tariffsStore.items)

onMounted(async () => {
  await tariffsStore.fetchAll()
})

async function removeTariff() {
  if (!tariffToRemove.value) {
    return
  }

  try {
    await tariffsStore.remove(tariffToRemove.value)
    uiStore.pushToast({ type: 'success', title: copy.value.created })
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.failed,
      message:
        error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  } finally {
    tariffToRemove.value = null
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
      <button class="btn-primary" type="button" @click="router.push('/manager/tariffs/new')">{{ copy.add }}</button>
    </div>

    <ErrorState v-if="tariffsStore.error" :message="tariffsStore.error" @retry="tariffsStore.fetchAll" />

    <div v-else-if="grouped.length" class="grid gap-6 xl:grid-cols-2">
      <article v-for="tariff in grouped" :key="tariff.id" class="card-base p-6">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {{ humanizeEnum(tariff.carClass) }}
            </p>
            <h2 class="mt-2 text-xl font-semibold text-foreground">{{ tariff.name }}</h2>
          </div>
          <div class="rounded-2xl bg-surface/70 px-3 py-2 text-sm font-medium text-foreground">
            {{ formatCurrency(tariff.dailyPrice) }}{{ locale === 'ru' ? '/сутки' : '/day' }}
          </div>
        </div>
        <p class="mt-4 text-sm text-muted-foreground">{{ tariff.description }}</p>
        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <div class="rounded-2xl bg-surface/70 p-4 text-sm text-muted-foreground">
            {{ locale === 'ru' ? 'База' : 'Base' }}:
            <span class="font-medium text-foreground">{{ formatCurrency(tariff.basePrice) }}</span>
          </div>
          <div class="rounded-2xl bg-surface/70 p-4 text-sm text-muted-foreground">
            {{ locale === 'ru' ? 'Депозит' : 'Deposit' }}:
            <span class="font-medium text-foreground">{{ formatCurrency(tariff.depositAmount) }}</span>
          </div>
          <div class="rounded-2xl bg-surface/70 p-4 text-sm text-muted-foreground">
            {{ locale === 'ru' ? 'Мин. срок' : 'Minimum' }}:
            <span class="font-medium text-foreground"
              >{{ tariff.minimumDays }} {{ locale === 'ru' ? 'сут.' : 'days' }}</span
            >
          </div>
          <div class="rounded-2xl bg-surface/70 p-4 text-sm text-muted-foreground">
            {{ locale === 'ru' ? 'Лимит' : 'Limit' }}:
            <span class="font-medium text-foreground">{{ tariff.mileageLimitKm }} km</span>
          </div>
        </div>
        <ul class="mt-4 space-y-2 text-sm text-muted-foreground">
          <li v-for="restriction in tariff.restrictions" :key="restriction">• {{ restriction }}</li>
        </ul>
        <div class="mt-5 flex gap-3">
          <button class="btn-secondary flex-1" type="button" @click="router.push(`/manager/tariffs/${tariff.id}/edit`)">
            {{ t('common.edit') }}
          </button>
          <button class="btn-secondary flex-1 text-danger" type="button" @click="tariffToRemove = tariff.id">
            {{ t('common.remove') }}
          </button>
        </div>
      </article>
    </div>

    <EmptyState
      v-else
      :title="copy.empty"
      :description="copy.emptyText"
      :action-label="copy.create"
      @action="router.push('/manager/tariffs/new')"
    />

    <ConfirmDialog
      :open="Boolean(tariffToRemove)"
      :title="copy.confirmTitle"
      :description="copy.confirmText"
      :confirm-label="t('common.remove')"
      danger
      @confirm="removeTariff"
      @update:open="!$event ? (tariffToRemove = null) : null"
    />
  </section>
</template>
