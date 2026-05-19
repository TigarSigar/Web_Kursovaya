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
        <span class="price-breakdown__label"
          >{{ formatCurrency(breakdown.dailyPrice) }} x {{ breakdown.totalDays }} {{ t('common.days') }}</span
        >
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
  padding: var(--card-padding-lg);

  &__header,
  &__row,
  &__total {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
  }

  &__header {
    margin-bottom: var(--space-3);
  }

  &__caption,
  &__label {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 700;
    color: rgb(var(--color-text-primary));
  }

  &__rows {
    display: grid;
    gap: var(--space-2);
  }

  &__value {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: rgb(var(--color-text-primary));
  }

  &__total {
    padding-top: var(--space-2);
    border-top: 1px solid var(--border-subtle);
  }

  &__total-label,
  &__total-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: rgb(var(--color-text-primary));
  }
}
</style>
