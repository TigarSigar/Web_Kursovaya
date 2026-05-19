<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from '@/i18n'
import type { SearchCarsParams } from '@/types/entities'
import { CAR_CLASSES } from '@/types/entities'
import DateRangePicker from '@/shared/ui/DateRangePicker.vue'
import { isValidDateRange } from '@/utils/date'
import { humanizeEnum } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    initial?: Partial<SearchCarsParams>
    locations?: string[]
    compact?: boolean
  }>(),
  {
    initial: () => ({}),
    locations: () => [],
    compact: false,
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

const rootClass = computed(() => ['search-form', { 'search-form--compact': props.compact }])

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
        <DateRangePicker v-model:from="form.from" v-model:to="form.to" :error="getRangeError()" />
      </div>

      <label class="field-group">
        <span class="field-label">{{ t('search.vehicleClass') }}</span>
        <select v-model="form.carClass" class="input-base">
          <option value="">{{ t('search.anyClass') }}</option>
          <option v-for="carClass in CAR_CLASSES" :key="carClass" :value="carClass">
            {{ humanizeEnum(carClass) }}
          </option>
        </select>
      </label>
    </div>

    <div class="search-form__footer">
      <div v-if="!props.compact" class="search-form__chips">
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
  display: grid;
  gap: 20px;
  padding: 20px;
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  background: var(--surface-panel);
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-panel);

  &--compact {
    gap: 16px;
    padding: 20px;
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
  }

  &--compact .search-form__footer {
    justify-content: flex-end;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__chip {
    min-height: 32px;
    padding: 0 12px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--surface-glass);
    color: var(--text-soft);
    font-size: var(--font-size-xs);

    &--accent {
      border-color: rgb(var(--color-accent) / 0.28);
      background: rgb(var(--color-accent) / 0.12);
      color: rgb(var(--color-accent));
    }
  }

  &__submit {
    height: 44px;
    padding: 0 20px;
    border-radius: 10px;
    justify-content: center;
    font-weight: 600;
  }
}

@media (min-width: 1024px) {
  .search-form {
    &__grid,
    &--compact .search-form__grid {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 0.95fr);
    }
  }
}

@media (max-width: 768px) {
  .search-form {
    gap: 16px;
    padding: 20px;

    &__submit {
      width: 100%;
    }
  }
}
</style>
