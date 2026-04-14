<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/i18n'
import type { CarFormModel } from '@/types/entities'
import { CAR_CLASSES, CAR_STATUSES, FUEL_TYPES, TRANSMISSIONS } from '@/types/entities'
import { humanizeEnum } from '@/utils/format'

const props = defineProps<{
  modelValue: CarFormModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CarFormModel]
}>()

const { locale } = useI18n()
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        make: 'Марка',
        model: 'Модель',
        plate: 'Госномер',
        year: 'Год',
        class: 'Класс',
        status: 'Статус',
        location: 'Локация',
        transmission: 'Коробка',
        fuel: 'Топливо',
        seats: 'Мест',
        odometer: 'Одометр, км',
        image: 'URL изображения',
        notes: 'Комментарий',
      }
    : {
        make: 'Make',
        model: 'Model',
        plate: 'Plate number',
        year: 'Year',
        class: 'Class',
        status: 'Status',
        location: 'Location',
        transmission: 'Transmission',
        fuel: 'Fuel',
        seats: 'Seats',
        odometer: 'Odometer, km',
        image: 'Image URL',
        notes: 'Notes',
      },
)

function update<K extends keyof CarFormModel>(key: K, value: CarFormModel[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2">
    <label class="field-group"><span class="field-label">{{ copy.make }}</span><input class="input-base" :value="modelValue.make" @input="update('make', ($event.target as HTMLInputElement).value)" /></label>
    <label class="field-group"><span class="field-label">{{ copy.model }}</span><input class="input-base" :value="modelValue.model" @input="update('model', ($event.target as HTMLInputElement).value)" /></label>
    <label class="field-group"><span class="field-label">VIN</span><input class="input-base" :value="modelValue.vin" @input="update('vin', ($event.target as HTMLInputElement).value)" /></label>
    <label class="field-group"><span class="field-label">{{ copy.plate }}</span><input class="input-base" :value="modelValue.plateNumber" @input="update('plateNumber', ($event.target as HTMLInputElement).value)" /></label>
    <label class="field-group"><span class="field-label">{{ copy.year }}</span><input class="input-base" min="2018" type="number" :value="modelValue.year" @input="update('year', Number(($event.target as HTMLInputElement).value))" /></label>
    <label class="field-group"><span class="field-label">{{ copy.class }}</span><select class="input-base" :value="modelValue.carClass" @change="update('carClass', ($event.target as HTMLSelectElement).value as CarFormModel['carClass'])"><option v-for="item in CAR_CLASSES" :key="item" :value="item">{{ humanizeEnum(item) }}</option></select></label>
    <label class="field-group"><span class="field-label">{{ copy.status }}</span><select class="input-base" :value="modelValue.status" @change="update('status', ($event.target as HTMLSelectElement).value as CarFormModel['status'])"><option v-for="item in CAR_STATUSES" :key="item" :value="item">{{ humanizeEnum(item) }}</option></select></label>
    <label class="field-group"><span class="field-label">{{ copy.location }}</span><input class="input-base" :value="modelValue.location" @input="update('location', ($event.target as HTMLInputElement).value)" /></label>
    <label class="field-group"><span class="field-label">{{ copy.transmission }}</span><select class="input-base" :value="modelValue.transmission" @change="update('transmission', ($event.target as HTMLSelectElement).value as CarFormModel['transmission'])"><option v-for="item in TRANSMISSIONS" :key="item" :value="item">{{ humanizeEnum(item) }}</option></select></label>
    <label class="field-group"><span class="field-label">{{ copy.fuel }}</span><select class="input-base" :value="modelValue.fuelType" @change="update('fuelType', ($event.target as HTMLSelectElement).value as CarFormModel['fuelType'])"><option v-for="item in FUEL_TYPES" :key="item" :value="item">{{ humanizeEnum(item) }}</option></select></label>
    <label class="field-group"><span class="field-label">{{ copy.seats }}</span><input class="input-base" min="2" type="number" :value="modelValue.seats" @input="update('seats', Number(($event.target as HTMLInputElement).value))" /></label>
    <label class="field-group"><span class="field-label">{{ copy.odometer }}</span><input class="input-base" min="0" type="number" :value="modelValue.odometerKm" @input="update('odometerKm', Number(($event.target as HTMLInputElement).value))" /></label>
    <label class="field-group md:col-span-2"><span class="field-label">{{ copy.image }}</span><input class="input-base" :value="modelValue.imageUrl" @input="update('imageUrl', ($event.target as HTMLInputElement).value)" /></label>
    <label class="field-group md:col-span-2"><span class="field-label">{{ copy.notes }}</span><textarea class="input-base min-h-[110px]" :value="modelValue.notes" @input="update('notes', ($event.target as HTMLTextAreaElement).value)" /></label>
  </div>
</template>
