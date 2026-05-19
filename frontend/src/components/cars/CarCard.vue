<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, ChevronLeft, ChevronRight, Fuel, Settings2, Users } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import type { AvailableCarResult, Car } from '@/types/entities'
import { formatCurrency, humanizeEnum } from '@/utils/format'
import { getNextGalleryIndex, getPreviousGalleryIndex, resolveImageUrls } from '@/utils/carousel'
import { getCarCardDetailsCopy } from '@/components/cars/carCardCopy'
import StatusBadge from '@/shared/ui/StatusBadge.vue'

const props = withDefaults(
  defineProps<{
    car: Car
    result?: AvailableCarResult
    actionLabel?: string
    actionTo?: string
  }>(),
  {
    result: undefined,
    actionLabel: undefined,
    actionTo: undefined,
  },
)

const { t, locale } = useI18n()
const expanded = ref(false)
const selectedImageIndex = ref(0)

const primaryTariff = computed(() => props.result?.tariffs[0] ?? null)
const imageUrls = computed(() => resolveImageUrls(props.car))
const selectedImage = computed(() => imageUrls.value[selectedImageIndex.value] ?? '/car-placeholder.svg')
const imageCounter = computed(() => `${selectedImageIndex.value + 1}/${Math.max(imageUrls.value.length, 1)}`)
const detailCopy = computed(() => getCarCardDetailsCopy(locale.value))

function toggleExpanded() {
  expanded.value = !expanded.value
}

function showPreviousImage() {
  selectedImageIndex.value = getPreviousGalleryIndex(selectedImageIndex.value, imageUrls.value.length)
}

function showNextImage() {
  selectedImageIndex.value = getNextGalleryIndex(selectedImageIndex.value, imageUrls.value.length)
}

watch(
  () => props.car.id,
  () => {
    selectedImageIndex.value = 0
    expanded.value = false
  },
)
</script>

<template>
  <article class="car-card">
    <div class="car-card__hero" @click="toggleExpanded">
      <img :src="selectedImage" :alt="`${car.make} ${car.model}`" class="car-card__hero-image" />

      <div class="car-card__status">
        <StatusBadge :status="result?.available === true ? 'AVAILABLE' : car.status" size="sm" />
      </div>

      <div v-if="imageUrls.length > 1" class="car-card__gallery-controls">
        <button
          class="car-card__gallery-button"
          type="button"
          :aria-label="detailCopy.previousPhoto"
          @click.stop="showPreviousImage"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>
        <span class="car-card__gallery-counter">{{ imageCounter }}</span>
        <button
          class="car-card__gallery-button"
          type="button"
          :aria-label="detailCopy.nextPhoto"
          @click.stop="showNextImage"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="car-card__body">
      <div class="car-card__heading">
        <div class="car-card__heading-main">
          <p class="car-card__class">{{ humanizeEnum(car.carClass) }}</p>
          <h3 class="car-card__title">{{ car.make }} {{ car.model }}</h3>
          <p class="car-card__meta">{{ car.year }} • {{ car.plateNumber }}</p>
        </div>

        <div class="car-card__current-status">
          <p class="car-card__current-status-label">{{ t('common.currentStatus') }}</p>
          <p class="car-card__current-status-value">{{ humanizeEnum(car.status) }}</p>
        </div>
      </div>

      <div class="car-card__features">
        <div class="car-card__feature">
          <Users class="car-card__feature-icon" />
          <span class="car-card__feature-text">{{ car.seats }} {{ t('common.seats') }}</span>
        </div>
        <div class="car-card__feature">
          <Settings2 class="car-card__feature-icon" />
          <span class="car-card__feature-text">{{ humanizeEnum(car.transmission) }}</span>
        </div>
        <div class="car-card__feature">
          <Fuel class="car-card__feature-icon" />
          <span class="car-card__feature-text">{{ humanizeEnum(car.fuelType) }}</span>
        </div>
      </div>

      <div class="car-card__footer">
        <div>
          <p class="car-card__footer-label">{{ t('common.location') }}</p>
          <p class="car-card__footer-value">{{ car.location }}</p>
        </div>
        <div class="car-card__price">
          <p class="car-card__footer-label">{{ t('common.from') }}</p>
          <p class="car-card__price-value">
            {{ formatCurrency(primaryTariff?.dailyPrice ?? 0) }}
            <span class="car-card__price-unit">{{ t('common.perDay') }}</span>
          </p>
        </div>
      </div>

      <div class="car-card__actions">
        <button class="car-card__details-button" type="button" @click.stop="toggleExpanded">
          {{ expanded ? detailCopy.hide : detailCopy.show }}
          <ChevronDown class="h-4 w-4 transition" :class="{ 'rotate-180': expanded }" />
        </button>

        <RouterLink v-if="actionTo" class="btn-primary car-card__primary-action" :to="actionTo" @click.stop>
          {{ actionLabel ?? t('common.open') }}
        </RouterLink>
      </div>

      <transition name="toast">
        <div v-if="expanded" class="car-card__details">
          <div class="car-card__details-grid">
            <div class="car-card__details-panel">
              <p class="car-card__details-label">{{ detailCopy.vin }}</p>
              <p class="car-card__details-value">{{ car.vin }}</p>
            </div>
            <div class="car-card__details-panel">
              <p class="car-card__details-label">{{ detailCopy.mileage }}</p>
              <p class="car-card__details-value">
                {{ car.odometerKm.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US') }} km
              </p>
            </div>
            <div v-if="primaryTariff" class="car-card__details-panel">
              <p class="car-card__details-label">{{ detailCopy.tariff }}</p>
              <p class="car-card__details-value">{{ primaryTariff.name }}</p>
              <p class="car-card__details-subvalue">
                {{ detailCopy.basePrice }}: {{ formatCurrency(primaryTariff.basePrice) }}
              </p>
            </div>
            <div class="car-card__details-panel">
              <p class="car-card__details-label">{{ detailCopy.notes }}</p>
              <p class="car-card__details-text">{{ car.notes || detailCopy.noNotes }}</p>
            </div>
          </div>

          <div v-if="primaryTariff?.restrictions?.length" class="car-card__details-panel car-card__details-panel--full">
            <p class="car-card__details-label">{{ detailCopy.restrictions }}</p>
            <ul class="car-card__restrictions">
              <li v-for="restriction in primaryTariff.restrictions" :key="restriction">• {{ restriction }}</li>
            </ul>
          </div>
        </div>
      </transition>

      <div v-if="result && !result.available" class="car-card__unavailable">
        <p class="font-medium">{{ t('common.unavailableSelectedDates') }}</p>
        <ul class="mt-2 space-y-1">
          <li v-for="reason in result.reasons" :key="reason">• {{ reason }}</li>
        </ul>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.car-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  background: var(--surface-glass);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-card);

  &__hero {
    position: relative;
    padding: var(--space-3);
    border-bottom: 1px solid var(--border-subtle);
    background: var(--surface-hero);
    cursor: pointer;
  }

  &__hero-image {
    display: block;
    width: 100%;
    min-height: 210px;
    aspect-ratio: 16 / 10;
    border-radius: var(--radius-sm);
    object-fit: cover;
    background: rgb(var(--color-surface-raised));
  }

  &__status {
    position: absolute;
    top: calc(var(--space-3) + var(--space-1));
    right: calc(var(--space-3) + var(--space-1));
  }

  &__gallery-controls {
    position: absolute;
    right: var(--space-4);
    bottom: var(--space-4);
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--surface-glass-strong);
    backdrop-filter: blur(10px);
  }

  &__gallery-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    color: rgb(var(--color-text-primary));
    background: var(--surface-glass);
    transition:
      background-color var(--duration-fast) var(--ease-standard),
      border-color var(--duration-fast) var(--ease-standard);

    &:hover {
      border-color: var(--border-strong);
      background: var(--surface-glass-hover);
    }
  }

  &__gallery-counter {
    min-width: 32px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-align: center;
    color: rgb(var(--color-text-primary));
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 20px;
  }

  &__heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: flex-start;
    gap: 12px;
  }

  &__heading-main {
    min-width: 0;
  }

  &__class {
    font-size: var(--font-size-xs);
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgb(var(--color-accent));
  }

  &__title {
    margin-top: var(--space-1);
    font-size: clamp(1.15rem, 1.4vw, 1.4rem);
    font-weight: 700;
    line-height: 1.25;
    color: rgb(var(--color-text-primary));
  }

  &__meta {
    margin-top: var(--space-1);
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }

  &__current-status {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-subtle);
    background: rgb(var(--color-surface-muted) / 0.4);
    text-align: right;
  }

  &__current-status-label,
  &__footer-label,
  &__details-label {
    font-size: var(--font-size-xs);
    color: var(--text-faint);
  }

  &__current-status-value,
  &__footer-value,
  &__details-value {
    margin-top: var(--space-1);
    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(var(--color-text-primary));
  }

  &__features {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
    color: var(--text-soft);
  }

  &__feature,
  &__details-panel {
    padding: var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--surface-glass);
  }

  &__feature {
    flex: 1 1 122px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 12px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: transparent;
  }

  &__feature-icon {
    flex-shrink: 0;
    color: rgb(var(--color-accent));
    width: 16px;
    height: 16px;
  }

  &__feature-text {
    font-size: var(--font-size-xs);
    line-height: 1.35;
  }

  &__footer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }

  &__price {
    text-align: right;
  }

  &__price-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: rgb(var(--color-text-primary));
  }

  &__price-unit {
    margin-left: var(--space-2);
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--text-faint);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 12px;
  }

  &__details-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    height: 40px;
    padding: 0 20px;
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    color: rgb(var(--color-text-primary));
    background: var(--surface-glass);
    transition:
      background-color var(--duration-fast) var(--ease-standard),
      border-color var(--duration-fast) var(--ease-standard);

    &:hover {
      border-color: var(--border-strong);
      background: var(--surface-glass-hover);
    }
  }

  &__primary-action {
    flex: 1 1 0;
    height: 40px;
    padding: 0 20px;
    border-radius: 10px;
    justify-content: center;
  }

  &__details {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border-subtle);
  }

  &__details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  &__details-panel--full {
    margin-top: 12px;
  }

  &__details-subvalue,
  &__details-text,
  &__restrictions {
    margin-top: 8px;
    font-size: var(--font-size-sm);
    color: var(--text-soft);
  }

  &__restrictions {
    display: grid;
    gap: var(--space-1);
  }

  &__unavailable {
    margin-top: 12px;
    padding: 16px;
    border-radius: var(--radius-sm);
    background: rgb(var(--color-error) / 0.12);
    color: rgb(var(--color-error));
    font-size: var(--font-size-sm);
  }
}

@media (max-width: 1024px) {
  .car-card {
    &__hero-image {
      min-height: 200px;
    }

    &__title {
      font-size: 1.25rem;
    }

    &__price-value {
      font-size: 1.125rem;
    }
  }
}

@media (max-width: 768px) {
  .car-card {
    &__hero,
    &__body {
      padding: var(--space-3);
    }

    &__heading,
    &__footer {
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    &__current-status,
    &__price {
      text-align: left;
    }

    &__features {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    &__details-grid {
      grid-template-columns: 1fr;
    }

    &__primary-action,
    &__details-button {
      width: 100%;
      flex-basis: 100%;
    }

    &__gallery-controls {
      right: var(--space-3);
      bottom: var(--space-3);
    }
  }
}
</style>
