<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, Fuel, Settings2, Users, X, Star, UserRound } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import type { Car, CarReview } from '@/types/entities'
import { fetchCarReviews, createCarReview } from '@/api/reviews'
import { useAuthStore } from '@/store/auth'
import { useUiStore } from '@/store/ui'
import { formatCurrency, humanizeEnum } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge.vue'

const props = defineProps<{
  car: Car
}>()

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()
const uiStore = useUiStore()

const modalOpen = ref(false)
const selectedImageIndex = ref(0)
const reviews = ref<CarReview[]>([])
const newReviewContent = ref('')
const newReviewRating = ref(5)
const loadingReviews = ref(false)
const submittingReview = ref(false)

async function loadReviews() {
  if (!props.car.id) return
  loadingReviews.value = true
  try {
    reviews.value = await fetchCarReviews(props.car.id)
  } catch (e) {
    console.error(e)
  } finally {
    loadingReviews.value = false
  }
}

async function submitReview() {
  if (!authStore.currentClientProfile) return
  if (!newReviewContent.value.trim()) return

  submittingReview.value = true
  try {
    await createCarReview(props.car.id, authStore.currentClientProfile.id, {
      content: newReviewContent.value,
      rating: newReviewRating.value
    })
    newReviewContent.value = ''
    newReviewRating.value = 5
    await loadReviews()
  } catch (e) {
    uiStore.pushToast({ type: 'error', title: 'Ошибка', message: 'Не удалось отправить отзыв' })
  } finally {
    submittingReview.value = false
  }
}

const imageUrls = computed(() => (props.car.imageUrls?.length ? props.car.imageUrls : props.car.imageUrl ? [props.car.imageUrl] : []))
const selectedImage = computed(() => imageUrls.value[selectedImageIndex.value] ?? '/car-placeholder.svg')
const imageCounter = computed(() => `${selectedImageIndex.value + 1}/${Math.max(imageUrls.value.length, 1)}`)

const detailCopy = computed(() =>
  locale.value === 'ru'
    ? {
        show: 'Подробнее',
        book: 'Оформить аренду',
        close: 'Закрыть',
        vin: 'VIN',
        mileage: 'Пробег',
        notes: 'Комментарий',
        noNotes: 'Комментарий не указан',
      }
    : {
        show: 'View details',
        book: 'Book rental',
        close: 'Close',
        vin: 'VIN',
        mileage: 'Mileage',
        notes: 'Notes',
        noNotes: 'No notes provided',
      },
)

function openModal() {
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
}

function bookRental() {
  router.push(`/client/rentals/new?carId=${props.car.id}`)
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
    modalOpen.value = false
  },
)

watch(modalOpen, (isOpen) => {
  if (isOpen) {
    loadReviews()
  }
})
</script>

<template>
  <article class="car-card">
    <div class="car-card__hero" @click="openModal">
      <img :src="selectedImage" alt="" class="car-card__hero-image" />

      <div class="car-card__status">
        <StatusBadge :status="car.status" size="sm" />
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
            {{ formatCurrency(car.pricePerDay ?? 0) }}
            <span class="car-card__price-unit">{{ t('common.perDay') }}</span>
          </p>
        </div>
      </div>

      <div class="car-card__actions">
        <button class="car-card__details-button" type="button" @click.stop="openModal">
          {{ detailCopy.show }}
        </button>
      </div>
    </div>
  </article>

  <Teleport to="body">
    <div v-if="modalOpen" class="car-modal-overlay" @click.self="closeModal">
      <div class="car-modal">
        <button class="car-modal__close" type="button" :aria-label="detailCopy.close" @click="closeModal">
          <X class="h-6 w-6" />
        </button>

        <div class="car-modal__hero">
          <img :src="selectedImage" alt="" class="car-modal__hero-image" />

          <div v-if="imageUrls.length > 1" class="car-modal__gallery-controls">
            <button class="car-modal__gallery-button" type="button" :aria-label="locale === 'ru' ? 'Предыдущее фото' : 'Previous photo'" @click.stop="showPreviousImage">
              <ChevronLeft class="h-5 w-5" />
            </button>
            <span class="car-modal__gallery-counter">{{ imageCounter }}</span>
            <button class="car-modal__gallery-button" type="button" :aria-label="locale === 'ru' ? 'Следующее фото' : 'Next photo'" @click.stop="showNextImage">
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="car-modal__content">
          <div class="car-modal__header">
            <div>
              <p class="car-modal__class">{{ humanizeEnum(car.carClass) }}</p>
              <h2 class="car-modal__title">{{ car.make }} {{ car.model }}</h2>
              <p class="car-modal__meta">{{ car.year }} • {{ car.plateNumber }}</p>
            </div>
            <div class="car-modal__price">
              <p class="car-modal__price-value">{{ formatCurrency(car.pricePerDay ?? 0) }}</p>
              <p class="car-modal__price-unit">{{ t('common.perDay') }}</p>
            </div>
          </div>

          <div class="car-modal__features">
            <div class="car-modal__feature">
              <Users class="car-modal__feature-icon" />
              <span>{{ car.seats }} {{ t('common.seats') }}</span>
            </div>
            <div class="car-modal__feature">
              <Settings2 class="car-modal__feature-icon" />
              <span>{{ humanizeEnum(car.transmission) }}</span>
            </div>
            <div class="car-modal__feature">
              <Fuel class="car-modal__feature-icon" />
              <span>{{ humanizeEnum(car.fuelType) }}</span>
            </div>
          </div>

          <div class="car-modal__details">
            <div class="car-modal__details-grid">
              <div class="car-modal__details-panel">
                <p class="car-modal__details-label">{{ detailCopy.vin }}</p>
                <p class="car-modal__details-value">{{ car.vin }}</p>
              </div>
              <div class="car-modal__details-panel">
                <p class="car-modal__details-label">{{ detailCopy.mileage }}</p>
                <p class="car-modal__details-value">{{ car.odometerKm.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US') }} km</p>
              </div>
              <div class="car-modal__details-panel">
                <p class="car-modal__details-label">{{ t('common.location') }}</p>
                <p class="car-modal__details-value">{{ car.location }}</p>
              </div>
              <div class="car-modal__details-panel car-modal__details-panel--full">
                <p class="car-modal__details-label">{{ detailCopy.notes }}</p>
                <p class="car-modal__details-text">{{ car.notes || detailCopy.noNotes }}</p>
              </div>
            </div>
          </div>

          <div class="car-modal__reviews">
            <h3 class="car-modal__reviews-title">Отзывы ({{ reviews.length }})</h3>

            <div v-if="authStore.currentClientProfile" class="car-modal__add-review">
              <div class="flex gap-2 mb-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  class="car-modal__star-btn"
                  @click="newReviewRating = star"
                >
                  <Star
                    class="h-5 w-5 transition-colors"
                    :class="star <= newReviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'"
                  />
                </button>
              </div>
              <textarea
                v-model="newReviewContent"
                class="input-base min-h-[80px] resize-y mb-3"
                placeholder="Оставьте отзыв об автомобиле..."
              ></textarea>
              <button
                class="btn-secondary"
                :disabled="submittingReview || !newReviewContent.trim()"
                @click="submitReview"
              >
                Опубликовать
              </button>
            </div>

            <div class="car-modal__reviews-list">
              <p v-if="loadingReviews" class="text-sm text-foreground/45">Загрузка отзывов...</p>
              <p v-else-if="reviews.length === 0" class="text-sm text-foreground/45">Пока нет отзывов.</p>
              <div v-for="review in reviews" :key="review.id" class="car-modal__review-item">
                <div class="flex items-center gap-3 mb-2">
                  <div class="h-8 w-8 rounded-full overflow-hidden border border-white/10 bg-primary/15 flex items-center justify-center text-primary">
                    <img v-if="review.authorAvatarBase64" :src="review.authorAvatarBase64" class="h-full w-full object-cover" />
                    <UserRound v-else class="h-4 w-4" />
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-foreground">{{ review.authorName }}</p>
                    <p class="text-xs text-foreground/45">{{ new Date(review.createdAt).toLocaleDateString() }}</p>
                  </div>
                  <div class="ml-auto flex">
                    <Star
                      v-for="i in 5"
                      :key="i"
                      class="h-3 w-3"
                      :class="i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'"
                    />
                  </div>
                </div>
                <p class="text-sm text-foreground/80 leading-relaxed">{{ review.content }}</p>
              </div>
            </div>
          </div>

          <div class="car-modal__actions">
            <button class="btn-primary car-modal__book-button" type="button" @click="bookRental">
              {{ detailCopy.book }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.car-card {
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--surface-glass);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;

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
    display: flex;
    flex-direction: column;
    flex: 1;
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
  &__footer-label {
    font-size: 12px;
    color: var(--text-faint);
  }

  &__current-status-value,
  &__footer-value {
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

  &__feature {
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
    flex: 1;
    align-items: flex-end;
  }

  &__details-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
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
}

.car-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  padding: 24px;
}

.car-modal {
  position: relative;
  width: 100%;
  max-width: 680px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  background: rgb(var(--color-background));
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 10;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 999px;
    color: white;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.6);
    }
  }

  &__hero {
    position: relative;
    width: 100%;
    height: 320px;
    background: var(--surface-hero);
  }

  &__hero-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__gallery-controls {
    position: absolute;
    right: 24px;
    bottom: 24px;
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: rgba(8, 9, 18, 0.64);
    backdrop-filter: blur(10px);
  }

  &__gallery-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
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
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    color: rgba(255, 255, 255, 0.82);
  }

  &__content {
    padding: 24px 32px 32px;
  }

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  &__class {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgb(var(--color-primary));
  }

  &__title {
    margin-top: 6px;
    font-size: 32px;
    font-weight: 700;
    line-height: 1.1;
    color: rgb(var(--color-foreground));
  }

  &__meta {
    margin-top: 6px;
    font-size: 15px;
    color: var(--text-muted);
  }

  &__price {
    text-align: right;
  }

  &__price-value {
    font-size: 32px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }

  &__price-unit {
    font-size: 14px;
    color: var(--text-faint);
  }

  &__features {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 24px;
    color: var(--text-soft);
  }

  &__feature {
    padding: 16px;
    border-radius: 12px;
    background: var(--surface-glass);
  }

  &__feature-icon {
    display: block;
    margin-bottom: 8px;
    color: rgb(var(--color-primary));
  }

  &__details {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid var(--border-subtle);
  }

  &__details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  &__details-panel {
    padding: 16px;
    border-radius: 12px;
    background: var(--surface-glass);

    &--full {
      grid-column: 1 / -1;
    }
  }

  &__details-label {
    font-size: 13px;
    color: var(--text-faint);
  }

  &__details-value {
    margin-top: 4px;
    font-size: 15px;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__details-text {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-soft);
  }

  &__reviews {
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid var(--border-subtle);
  }

  &__reviews-title {
    font-size: 20px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
    margin-bottom: 20px;
  }

  &__add-review {
    margin-bottom: 24px;
    padding: 16px;
    border-radius: 12px;
    background: var(--surface-glass);
  }

  &__star-btn {
    padding: 2px;
    transition: transform 0.2s ease;
    &:hover {
      transform: scale(1.1);
    }
  }

  &__reviews-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__review-item {
    padding: 16px;
    border-radius: 12px;
    background: var(--surface-glass);
    border: 1px solid var(--border-subtle);
  }

  &__actions {
    margin-top: 32px;
  }

  &__book-button {
    width: 100%;
    min-height: 52px;
    font-size: 16px;
    font-weight: 600;
    justify-content: center;
  }
}

html[data-theme='light'] .car-card {
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

html[data-theme='light'] .car-modal {
  .car-modal__gallery-controls {
    background: rgba(255, 255, 255, 0.88);
    border-color: rgba(31, 41, 55, 0.08);
  }

  .car-modal__gallery-button {
    color: rgb(var(--color-foreground));
    border-color: rgba(31, 41, 55, 0.08);
    background: rgba(255, 255, 255, 0.9);

    &:hover {
      border-color: rgba(31, 41, 55, 0.16);
      background: rgba(241, 245, 255, 0.96);
    }
  }

  .car-modal__gallery-counter {
    color: rgb(var(--color-foreground));
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

    &__features {
      grid-template-columns: 1fr;
    }
  }

  .car-modal {
    &__hero {
      height: 240px;
    }

    &__content {
      padding: 20px;
    }

    &__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    &__price {
      text-align: left;
    }

    &__features,
    &__details-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
