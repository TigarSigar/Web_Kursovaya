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
  <div class="grid gap-4 sm:grid-cols-2">
    <label class="field-group">
      <span class="field-label" :class="props.theme === 'dark' ? '!text-white' : ''">{{ t('search.pickupDate') }}</span>
      <input class="input-base" :class="props.theme === 'dark' ? '!border-white/8 !bg-white/[0.03] !text-white' : ''" type="date" :min="today" :value="props.from" @input="emit('update:from', ($event.target as HTMLInputElement).value)" />
    </label>
    <label class="field-group">
      <span class="field-label" :class="props.theme === 'dark' ? '!text-white' : ''">{{ t('search.returnDate') }}</span>
      <input class="input-base" :class="props.theme === 'dark' ? '!border-white/8 !bg-white/[0.03] !text-white' : ''" type="date" :min="props.from || today" :value="props.to" @input="emit('update:to', ($event.target as HTMLInputElement).value)" />
    </label>
  </div>
  <p v-if="props.error" class="mt-2 text-sm text-danger">{{ props.error }}</p>
</template>
