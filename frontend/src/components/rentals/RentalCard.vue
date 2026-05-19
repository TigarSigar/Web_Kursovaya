<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CalendarDays, MapPin } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import type { RentalOrder } from '@/types/entities'
import { formatCurrency } from '@/utils/format'
import { formatDate } from '@/utils/date'
import StatusBadge from '@/shared/ui/StatusBadge.vue'

defineProps<{
  rental: RentalOrder
  detailsTo: string
  showCancel?: boolean
}>()

defineEmits<{
  cancel: [rentalId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <article class="card-base p-5">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h3 class="text-lg font-semibold text-foreground">{{ rental.car?.make }} {{ rental.car?.model }}</h3>
          <StatusBadge :status="rental.status" size="sm" />
        </div>
        <p class="mt-1 text-sm text-muted-foreground">{{ rental.car?.plateNumber }} • {{ rental.tariff?.name }}</p>
      </div>
      <div class="text-right">
        <p class="text-sm text-muted-foreground">{{ t('common.total') }}</p>
        <p class="text-xl font-semibold text-foreground">{{ formatCurrency(rental.totalPrice) }}</p>
      </div>
    </div>

    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <div class="rounded-2xl bg-surface/70 p-4 text-sm text-muted-foreground">
        <CalendarDays class="mb-2 h-4 w-4 text-primary" />
        {{ formatDate(rental.from) }} - {{ formatDate(rental.to) }}
      </div>
      <div class="rounded-2xl bg-surface/70 p-4 text-sm text-muted-foreground">
        <MapPin class="mb-2 h-4 w-4 text-primary" />
        {{ t('search.pickupLocation') }}: {{ rental.pickupLocation }}
      </div>
    </div>

    <div class="mt-5 flex flex-wrap justify-between gap-3 border-t border-border/50 pt-4">
      <p class="text-sm text-muted-foreground">
        {{ rental.totalDays }} {{ t('common.days') }} • {{ t('common.order') }} {{ rental.id }}
      </p>
      <div class="flex gap-2">
        <button v-if="showCancel" class="btn-secondary text-danger" type="button" @click="$emit('cancel', rental.id)">
          {{ t('common.cancel') }}
        </button>
        <RouterLink class="btn-primary" :to="detailsTo">{{ t('common.details') }}</RouterLink>
      </div>
    </div>
  </article>
</template>
