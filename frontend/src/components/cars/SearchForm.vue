<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { SearchCarsParams } from '@/types/entities'
import { CAR_CLASSES } from '@/types/entities'
import DateRangePicker from '@/components/common/DateRangePicker.vue'
import { isValidDateRange } from '@/utils/date'
import { humanizeEnum } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    initial?: Partial<SearchCarsParams>
    locations?: string[]
    compact?: boolean
    theme?: 'light' | 'dark'
  }>(),
  {
    initial: () => ({}),
    locations: () => [],
    compact: false,
    theme: 'light',
  },
)

const emit = defineEmits<{
  submit: [value: SearchCarsParams]
}>()

const { t } = useI18n()

const form = reactive<SearchCarsParams>({
  from: props.initial.from ?? '',
  to: props.initial.to ?? '',
  location: props.initial.location ?? '',
  carClass: props.initial.carClass ?? '',
})

const rootClass = computed(() => ['search-form', `search-form--${props.theme}`, { 'search-form--compact': props.compact }])

watch(
  () => props.initial,
  (value) => {
    form.from = value.from ?? ''
    form.to = value.to ?? ''
    form.location = value.location ?? ''
    form.carClass = value.carClass ?? ''
  },
  { deep: true },
)

function submit() {
  emit('submit', { ...form })
}

function getRangeError(): string {
  if (!form.from || !form.to) {
    return ''
  }

  return isValidDateRange(form.from, form.to) ? '' : t('search.rangeError')
}
</script>

<template>
  <form :class="rootClass" @submit.prevent="submit">
    <div class="search-form__grid">
      <label class="field-group">
        <span class="field-label">{{ t('search.pickupLocation') }}</span>
        <select v-model="form.location" class="input-base">
          <option value="">{{ t('search.anyLocation') }}</option>
          <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
        </select>
      </label>

      <div class="search-form__dates">
        <DateRangePicker v-model:from="form.from" v-model:to="form.to" :error="getRangeError()" :theme="theme" />
      </div>

      <label class="field-group">
        <span class="field-label">{{ t('search.vehicleClass') }}</span>
        <select v-model="form.carClass" class="input-base">
          <option value="">{{ t('search.anyClass') }}</option>
          <option v-for="carClass in CAR_CLASSES" :key="carClass" :value="carClass">{{ humanizeEnum(carClass) }}</option>
        </select>
      </label>
    </div>

    <div class="search-form__footer">
      <div class="search-form__chips">
        <span class="search-form__chip search-form__chip--accent">{{ t('search.availabilityVerified') }}</span>
        <span class="search-form__chip">{{ t('search.instantConfirmation') }}</span>
        <span class="search-form__chip">{{ t('search.noHiddenFees') }}</span>
      </div>

      <button class="btn-primary search-form__submit" type="submit">
        {{ t('search.submit') }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.search-form {
  padding: 24px;
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  background: var(--surface-panel);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-panel);

  &--compact {
    padding: 16px;
  }

  &__grid {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
  }

  &__dates {
    min-width: 0;
  }

  &__footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 20px;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__chip {
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--surface-glass);
    color: var(--text-soft);
    font-size: 14px;

    &--accent {
      background: rgba(var(--color-primary), 0.12);
      color: rgb(var(--color-primary));
    }
  }

  &__submit {
    min-width: 180px;
    justify-content: center;
    padding: 16px 24px;
    font-size: 18px;
    font-weight: 700;
  }
}

@media (min-width: 1024px) {
  .search-form {
    &__grid {
      grid-template-columns: 1fr 2fr 1fr;
    }

    &--compact .search-form__grid {
      grid-template-columns: 1fr 2fr 1fr;
    }
  }
}

@media (max-width: 768px) {
  .search-form {
    padding: 16px;

    &__submit {
      width: 100%;
    }
  }
}
</style>
