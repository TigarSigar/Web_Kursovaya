<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import type { TariffFormModel } from '@/types/entities'
import { CAR_CLASSES } from '@/types/entities'
import { humanizeEnum } from '@/utils/format'

const props = defineProps<{
  modelValue: TariffFormModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TariffFormModel]
}>()

const { locale } = useI18n()
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        name: 'Название тарифа',
        class: 'Класс',
        minDays: 'Минимум суток',
        basePrice: 'Базовая цена',
        dailyPrice: 'Цена за сутки',
        mileage: 'Лимит пробега, км',
        deposit: 'Депозит',
        restrictions: 'Ограничения',
        description: 'Описание',
        insurance: 'Страховка включена в тариф',
      }
    : {
        name: 'Tariff name',
        class: 'Class',
        minDays: 'Minimum days',
        basePrice: 'Base price',
        dailyPrice: 'Daily price',
        mileage: 'Mileage limit, km',
        deposit: 'Deposit',
        restrictions: 'Restrictions',
        description: 'Description',
        insurance: 'Insurance included in tariff',
      },
)

function update<K extends keyof TariffFormModel>(key: K, value: TariffFormModel[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <label class="field-group md:col-span-2"
      ><span class="field-label">{{ copy.name }}</span
      ><input
        class="input-base"
        :value="modelValue.name"
        @input="update('name', ($event.target as HTMLInputElement).value)"
    /></label>
    <label class="field-group"
      ><span class="field-label">{{ copy.class }}</span
      ><select
        class="input-base"
        :value="modelValue.carClass"
        @change="update('carClass', ($event.target as HTMLSelectElement).value as TariffFormModel['carClass'])"
      >
        <option v-for="item in CAR_CLASSES" :key="item" :value="item">{{ humanizeEnum(item) }}</option>
      </select></label
    >
    <label class="field-group"
      ><span class="field-label">{{ copy.minDays }}</span
      ><input
        class="input-base"
        min="1"
        type="number"
        :value="modelValue.minimumDays"
        @input="update('minimumDays', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <label class="field-group"
      ><span class="field-label">{{ copy.basePrice }}</span
      ><input
        class="input-base"
        min="0"
        type="number"
        :value="modelValue.basePrice"
        @input="update('basePrice', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <label class="field-group"
      ><span class="field-label">{{ copy.dailyPrice }}</span
      ><input
        class="input-base"
        min="0"
        type="number"
        :value="modelValue.dailyPrice"
        @input="update('dailyPrice', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <label class="field-group"
      ><span class="field-label">{{ copy.mileage }}</span
      ><input
        class="input-base"
        min="0"
        type="number"
        :value="modelValue.mileageLimitKm"
        @input="update('mileageLimitKm', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <label class="field-group"
      ><span class="field-label">{{ copy.deposit }}</span
      ><input
        class="input-base"
        min="0"
        type="number"
        :value="modelValue.depositAmount"
        @input="update('depositAmount', Number(($event.target as HTMLInputElement).value))"
    /></label>
    <label class="field-group md:col-span-2">
      <span class="field-label">{{ copy.restrictions }}</span>
      <textarea
        class="input-base min-h-[110px]"
        :value="modelValue.restrictionsText"
        @input="update('restrictionsText', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>
    <label class="field-group md:col-span-2">
      <span class="field-label">{{ copy.description }}</span>
      <textarea
        class="input-base min-h-[110px]"
        :value="modelValue.description"
        @input="update('description', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>
    <label class="flex items-center gap-3 rounded-2xl border border-border/50 bg-surface/70 px-4 py-3 md:col-span-2">
      <input
        type="checkbox"
        :checked="modelValue.insuranceIncluded"
        @change="update('insuranceIncluded', ($event.target as HTMLInputElement).checked)"
      />
      <span class="text-sm text-foreground">{{ copy.insurance }}</span>
    </label>
  </div>
</template>
