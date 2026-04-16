<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, ChevronLeft, ChevronRight, Fuel, Settings2, Users } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import type { AvailableCarResult, Car } from '@/types/entities'
import { formatCurrency, humanizeEnum } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge.vue'

const props = withDefaults(
  defineProps<{
    car: Car
    result?: AvailableCarResult
    actionLabel?: string
    actionTo?: string
    theme?: 'light' | 'dark'
  }>(),
  {
    theme: 'dark',
  },
)

const { t, locale } = useI18n()
const expanded = ref(false)
const selectedImageIndex = ref(0)

const primaryTariff = computed(() => props.result?.tariffs[0] ?? null)
const imageUrls = computed(() => (props.car.imageUrls?.length ? props.car.imageUrls : props.car.imageUrl ? [props.car.imageUrl] : []))
const selectedImage = computed(() => imageUrls.value[selectedImageIndex.value] ?? '/car-placeholder.svg')
const imageCounter = computed(() => `${selectedImageIndex.value + 1}/${Math.max(imageUrls.value.length, 1)}`)
const cardClass = computed(() => ['car-card', `car-card--${props.theme}`])

const detailCopy = computed(() =>
  locale.value === 'ru'
    ? {
        show: 'Подробнее',
        hide: 'Скрыть детали',
        vin: 'VIN',
        mileage: 'Пробег',
        tariff: 'Тариф',
        basePrice: 'Базовая цена',
        restrictions: 'Ограничения',
        notes: 'Комментарий',
        noNotes: 'Комментарий не указан',
      }
    : {
        show: 'View details',
        hide: 'Hide details',
        vin: 'VIN',
        mileage: 'Mileage',
        tariff: 'Tariff',
        basePrice: 'Base fee',
        restrictions: 'Restrictions',
        notes: 'Notes',
        noNotes: 'No notes provided',
      },
)

function toggleExpanded() {
  expanded.value = !expanded.value
}

function showPreviousImage() {
  if (imageUrls.value.length <= 1) return
  selectedImageIndex.value = selectedImageIndex.value === 0 ? imageUrls.value.length - 1 : selectedImageIndex.value - 1
}

function showNextImage() {
  if (imageUrls.value.length <= 1) return
  selectedImageIndex.value = selectedImageIndex.value === imageUrls.value.length - 1 ? 0 : selectedImageIndex.value + 1
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
  <article :class="cardClass">
    <div class="car-card__hero" @click="toggleExpanded">
      <img :src="selectedImage" alt="" class="car-card__hero-image" />

      <div class="car-card__status">
        <StatusBadge :status="result?.available === true ? 'AVAILABLE' : car.status" size="sm" />
      </div>

      <div v-if="imageUrls.length > 1" class="car-card__gallery-controls">
        <button class="car-card__gallery-button" type="button" :aria-label="locale === 'ru' ? 'Предыдущее фото' : 'Previous photo'" @click.stop="showPreviousImage">
          <ChevronLeft class="h-4 w-4" />
        </button>
        <span class="car-card__gallery-counter">{{ imageCounter }}</span>
        <button class="car-card__gallery-button" type="button" :aria-label="locale === 'ru' ? 'Следующее фото' : 'Next photo'" @click.stop="showNextImage">
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="car-card__body">
      <div class="car-card__heading">
        <div>
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
          <span>{{ car.seats }} {{ t('common.seats') }}</span>
        </div>
        <div class="car-card__feature">
          <Settings2 class="car-card__feature-icon" />
          <span>{{ humanizeEnum(car.transmission) }}</span>
        </div>
        <div class="car-card__feature">
          <Fuel class="car-card__feature-icon" />
          <span>{{ humanizeEnum(car.fuelType) }}</span>
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

        <RouterLink
          v-if="actionTo"
          class="btn-primary car-card__primary-action"
          :to="actionTo"
          @click.stop
        >
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
              <p class="car-card__details-value">{{ car.odometerKm.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US') }} km</p>
            </div>
            <div v-if="primaryTariff" class="car-card__details-panel">
              <p class="car-card__details-label">{{ detailCopy.tariff }}</p>
              <p class="car-card__details-value">{{ primaryTariff.name }}</p>
              <p class="car-card__details-subvalue">{{ detailCopy.basePrice }}: {{ formatCurrency(primaryTariff.basePrice) }}</p>
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
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--surface-glass);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-card);

  &__hero {
    position: relative;
    padding: 20px;
    border-bottom: 1px solid var(--border-subtle);
    background: var(--surface-hero);
    cursor: pointer;
  }

  &__hero-image {
    display: block;
    width: 100%;
    height: 240px;
    border-radius: 8px;
    object-fit: cover;
    background: rgb(var(--color-surface-strong));
  }

  &__status {
    position: absolute;
    top: 28px;
    right: 28px;
  }

  &__gallery-controls {
    position: absolute;
    right: 32px;
    bottom: 32px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: rgba(8, 9, 18, 0.64);
    backdrop-filter: blur(10px);
  }

  &__gallery-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    color: white;
    background: rgba(255, 255, 255, 0.06);
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
      border-color: rgba(255, 255, 255, 0.28);
      background: rgba(255, 255, 255, 0.14);
    }
  }

  &__gallery-counter {
    min-width: 40px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    color: rgba(255, 255, 255, 0.82);
  }

  &__body {
    padding: 20px;
  }

  &__heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  &__class {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgb(var(--color-primary));
  }

  &__title {
    margin-top: 4px;
    font-size: 30px;
    font-weight: 700;
    line-height: 1.1;
    color: rgb(var(--color-foreground));
  }

  &__meta {
    margin-top: 4px;
    font-size: 14px;
    color: var(--text-muted);
  }

  &__current-status {
    min-width: 140px;
    padding: 12px 14px;
    border-radius: 8px;
    background: var(--surface-glass-strong);
    text-align: right;
  }

  &__current-status-label,
  &__footer-label,
  &__details-label {
    font-size: 12px;
    color: var(--text-faint);
  }

  &__current-status-value,
  &__footer-value,
  &__details-value {
    margin-top: 4px;
    font-size: 15px;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__features {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 20px;
    color: var(--text-soft);
  }

  &__feature,
  &__details-panel {
    padding: 14px;
    border-radius: 8px;
    background: var(--surface-glass);
  }

  &__feature-icon {
    display: block;
    margin-bottom: 8px;
    color: rgb(var(--color-primary));
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border-subtle);
  }

  &__price {
    text-align: right;
  }

  &__price-value {
    font-size: 28px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }

  &__price-unit {
    margin-left: 6px;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-faint);
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 16px;
  }

  &__details-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 170px;
    padding: 12px 16px;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    color: rgb(var(--color-foreground));
    background: var(--surface-glass);
    transition: background-color 0.2s ease, border-color 0.2s ease;

    &:hover {
      border-color: var(--border-strong);
      background: var(--surface-glass-hover);
    }
  }

  &__primary-action {
    flex: 1 1 220px;
    justify-content: center;
  }

  &__details {
    margin-top: 20px;
    padding-top: 20px;
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
    font-size: 14px;
    color: var(--text-soft);
  }

  &__restrictions {
    display: grid;
    gap: 6px;
  }

  &__unavailable {
    margin-top: 16px;
    padding: 16px;
    border-radius: 8px;
    background: rgba(var(--color-danger), 0.12);
    color: rgb(var(--color-danger));
    font-size: 14px;
  }

  &--light {
    .car-card__gallery-controls {
      background: rgba(255, 255, 255, 0.88);
      border-color: rgba(31, 41, 55, 0.08);
    }

    .car-card__gallery-button {
      color: rgb(var(--color-foreground));
      border-color: rgba(31, 41, 55, 0.08);
      background: rgba(255, 255, 255, 0.9);

      &:hover {
        border-color: rgba(31, 41, 55, 0.16);
        background: rgba(241, 245, 255, 0.96);
      }
    }

    .car-card__gallery-counter {
      color: rgb(var(--color-foreground));
    }
  }
}

@media (max-width: 1024px) {
  .car-card {
    &__hero-image {
      height: 220px;
    }

    &__title {
      font-size: 24px;
    }

    &__price-value {
      font-size: 24px;
    }
  }
}

@media (max-width: 768px) {
  .car-card {
    &__hero,
    &__body {
      padding: 16px;
    }

    &__heading,
    &__footer {
      flex-direction: column;
      align-items: stretch;
    }

    &__current-status,
    &__price {
      text-align: left;
    }

    &__features,
    &__details-grid {
      grid-template-columns: 1fr;
    }

    &__primary-action,
    &__details-button {
      width: 100%;
      flex-basis: 100%;
    }
  }
}
</style>
