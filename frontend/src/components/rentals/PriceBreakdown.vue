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
  <div class="card-base price-breakdown">
    <div class="price-breakdown__header">
      <div>
        <p class="price-breakdown__caption">{{ t('rental.priceBreakdown') }}</p>
        <h3 class="price-breakdown__title">{{ tariff?.name ?? t('rental.selectedTariff') }}</h3>
      </div>
      <slot name="badge" />
    </div>

    <div class="price-breakdown__rows">
      <div class="price-breakdown__row">
        <span class="price-breakdown__label">{{ t('rental.baseFee') }}</span>
        <span class="price-breakdown__value">{{ formatCurrency(breakdown.basePrice) }}</span>
      </div>
      <div class="price-breakdown__row">
        <span class="price-breakdown__label">{{ formatCurrency(breakdown.dailyPrice) }} x {{ breakdown.totalDays }} {{ t('common.days') }}</span>
        <span class="price-breakdown__value">{{ formatCurrency(breakdown.dailySubtotal) }}</span>
      </div>
      <div class="price-breakdown__total">
        <span class="price-breakdown__total-label">{{ t('rental.total') }}</span>
        <span class="price-breakdown__total-value">{{ formatCurrency(breakdown.totalPrice) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.price-breakdown {
  padding: 20px;

  &__header,
  &__row,
  &__total {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  &__header {
    margin-bottom: 16px;
  }

  &__caption,
  &__label {
    font-size: 14px;
    color: var(--text-muted);
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }

  &__rows {
    display: grid;
    gap: 12px;
  }

  &__value {
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__total {
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }

  &__total-label,
  &__total-value {
    font-size: 20px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }
}
</style>
