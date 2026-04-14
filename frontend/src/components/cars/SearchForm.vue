<script setup lang="ts">
import { reactive, watch } from 'vue'
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
  <form
    class="rounded-[28px] p-6 backdrop-blur"
    :class="[
      compact ? 'p-4' : '',
      theme === 'dark'
        ? 'border border-white/8 bg-[#0b0b15]/72 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]'
        : 'border border-border bg-white/85 shadow-soft',
    ]"
    @submit.prevent="submit"
  >
    <div class="grid gap-4" :class="compact ? 'lg:grid-cols-[1fr_2fr_1fr_auto]' : 'lg:grid-cols-4'">
      <label class="field-group">
        <span class="field-label" :class="theme === 'dark' ? '!text-white' : ''">{{ t('search.pickupLocation') }}</span>
        <select v-model="form.location" class="input-base" :class="theme === 'dark' ? '!border-white/8 !bg-white/[0.03] !text-white' : ''">
          <option value="">{{ t('search.anyLocation') }}</option>
          <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
        </select>
      </label>

      <div class="lg:col-span-2">
        <DateRangePicker v-model:from="form.from" v-model:to="form.to" :error="getRangeError()" :theme="theme" />
      </div>

      <label class="field-group">
        <span class="field-label" :class="theme === 'dark' ? '!text-white' : ''">{{ t('search.vehicleClass') }}</span>
        <select v-model="form.carClass" class="input-base" :class="theme === 'dark' ? '!border-white/8 !bg-white/[0.03] !text-white' : ''">
          <option value="">{{ t('search.anyClass') }}</option>
          <option v-for="carClass in CAR_CLASSES" :key="carClass" :value="carClass">{{ humanizeEnum(carClass) }}</option>
        </select>
      </label>
    </div>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2 text-sm">
        <span class="rounded-full px-3 py-1" :class="theme === 'dark' ? 'bg-white/[0.04] text-white/50' : 'bg-primary/10 text-primary'">{{ t('search.availabilityVerified') }}</span>
        <span class="rounded-full px-3 py-1" :class="theme === 'dark' ? 'bg-white/[0.04] text-white/50' : 'bg-slate-100 text-muted-foreground'">{{ t('search.instantConfirmation') }}</span>
        <span class="rounded-full px-3 py-1" :class="theme === 'dark' ? 'bg-white/[0.04] text-white/50' : 'bg-slate-100 text-muted-foreground'">{{ t('search.noHiddenFees') }}</span>
      </div>
      <button
        class="min-w-[180px] justify-center rounded-2xl px-6 py-4 text-lg font-semibold"
        :class="
          theme === 'dark'
            ? 'bg-gradient-to-r from-primary to-[#8b5cf6] text-white shadow-[0_0_30px_rgba(139,92,246,0.28)]'
            : 'btn-primary'
        "
        type="submit"
      >
        {{ t('search.submit') }}
      </button>
    </div>
  </form>
</template>
