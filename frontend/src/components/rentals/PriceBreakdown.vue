<script setup lang="ts">
import { useI18n } from '@/i18n'
import type { PriceBreakdown as Breakdown, Tariff } from '@/types/entities'
import { formatCurrency } from '@/utils/format'

defineProps<{
  breakdown: Breakdown
  tariff?: Tariff | null
}>()

const { t } = useI18n()
</script>

<template>
  <div class="card-base p-5">
    <div class="mb-4 flex items-start justify-between gap-4">
      <div>
        <p class="text-sm text-white/45">{{ t('rental.priceBreakdown') }}</p>
        <h3 class="text-lg font-semibold text-white">{{ tariff?.name ?? t('rental.selectedTariff') }}</h3>
      </div>
      <slot name="badge" />
    </div>

    <div class="space-y-3 text-sm">
      <div class="flex items-center justify-between">
        <span class="text-white/45">{{ t('rental.baseFee') }}</span>
        <span class="font-medium text-white">{{ formatCurrency(breakdown.basePrice) }}</span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-white/45">{{ formatCurrency(breakdown.dailyPrice) }} x {{ breakdown.totalDays }} {{ t('common.days') }}</span>
        <span class="font-medium text-white">{{ formatCurrency(breakdown.dailySubtotal) }}</span>
      </div>
      <div class="border-t border-white/8 pt-3">
        <div class="flex items-center justify-between">
          <span class="text-base font-semibold text-white">{{ t('rental.total') }}</span>
          <span class="text-xl font-semibold text-white">{{ formatCurrency(breakdown.totalPrice) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
