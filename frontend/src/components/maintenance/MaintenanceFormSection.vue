<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import type { Car, MaintenanceFormModel } from '@/types/entities'
import { MAINTENANCE_STATUSES } from '@/types/entities'
import { humanizeEnum } from '@/utils/format'

const props = defineProps<{
  modelValue: MaintenanceFormModel
  cars: Car[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MaintenanceFormModel]
}>()

const { locale } = useI18n()
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        car: 'Автомобиль',
        select: 'Выберите автомобиль',
        from: 'Дата начала',
        to: 'Дата окончания',
        type: 'Тип обслуживания',
        status: 'Статус',
        comment: 'Комментарий',
        cost: 'Оценка стоимости',
      }
    : {
        car: 'Vehicle',
        select: 'Select a vehicle',
        from: 'Start date',
        to: 'End date',
        type: 'Service type',
        status: 'Status',
        comment: 'Comment',
        cost: 'Estimated cost',
      },
)

function update<K extends keyof MaintenanceFormModel>(key: K, value: MaintenanceFormModel[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <label class="field-group md:col-span-2">
      <span class="field-label">{{ copy.car }}</span>
      <select class="input-base" :value="modelValue.carId" @change="update('carId', ($event.target as HTMLSelectElement).value)">
        <option value="">{{ copy.select }}</option>
        <option v-for="car in cars" :key="car.id" :value="car.id">{{ car.make }} {{ car.model }} • {{ car.plateNumber }}</option>
      </select>
    </label>
    <label class="field-group">
      <span class="field-label">{{ copy.from }}</span>
      <input class="input-base" type="date" :value="modelValue.from" @input="update('from', ($event.target as HTMLInputElement).value)" />
    </label>
    <label class="field-group">
      <span class="field-label">{{ copy.to }}</span>
      <input class="input-base" type="date" :value="modelValue.to" @input="update('to', ($event.target as HTMLInputElement).value)" />
    </label>
    <label class="field-group">
      <span class="field-label">{{ copy.type }}</span>
      <input class="input-base" :value="modelValue.serviceType" @input="update('serviceType', ($event.target as HTMLInputElement).value)" />
    </label>
    <label class="field-group">
      <span class="field-label">{{ copy.status }}</span>
      <select class="input-base" :value="modelValue.status" @change="update('status', ($event.target as HTMLSelectElement).value as MaintenanceFormModel['status'])">
        <option v-for="item in MAINTENANCE_STATUSES" :key="item" :value="item">{{ humanizeEnum(item) }}</option>
      </select>
    </label>
    <label class="field-group md:col-span-2">
      <span class="field-label">{{ copy.comment }}</span>
      <textarea class="input-base min-h-[110px]" :value="modelValue.comment" @input="update('comment', ($event.target as HTMLTextAreaElement).value)" />
    </label>
    <label class="field-group">
      <span class="field-label">{{ copy.cost }}</span>
      <input
        class="input-base"
        min="0"
        type="number"
        :value="modelValue.estimatedCost ?? ''"
        @input="update('estimatedCost', ($event.target as HTMLInputElement).value ? Number(($event.target as HTMLInputElement).value) : null)"
      />
    </label>
  </div>
</template>
