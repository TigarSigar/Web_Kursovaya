<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import { getTodayIsoDate } from '@/utils/date'

const props = defineProps<{
  from: string
  to: string
  error?: string
  theme?: 'light' | 'dark'
}>()

const emit = defineEmits<{
  'update:from': [value: string]
  'update:to': [value: string]
}>()

const today = computed(() => getTodayIsoDate())
const { t } = useI18n()
</script>

<template>
  <div class="date-range-picker">
    <label class="field-group">
      <span class="field-label">{{ t('search.pickupDate') }}</span>
      <input
        class="input-base"
        type="date"
        :min="today"
        :value="props.from"
        @input="emit('update:from', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <label class="field-group">
      <span class="field-label">{{ t('search.returnDate') }}</span>
      <input
        class="input-base"
        type="date"
        :min="props.from || today"
        :value="props.to"
        @input="emit('update:to', ($event.target as HTMLInputElement).value)"
      />
    </label>
  </div>

  <p v-if="props.error" class="date-range-picker__error">{{ props.error }}</p>
</template>

<style scoped lang="scss">
.date-range-picker {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  &__error {
    margin-top: 8px;
    font-size: 14px;
    color: rgb(var(--color-danger));
  }
}

@media (max-width: 640px) {
  .date-range-picker {
    grid-template-columns: 1fr;
  }
}
</style>
