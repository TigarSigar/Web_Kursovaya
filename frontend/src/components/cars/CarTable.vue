<script setup lang="ts">
import { Pencil, Trash2 } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import type { Car } from '@/types/entities'
import StatusBadge from '@/shared/ui/StatusBadge.vue'
import { humanizeEnum } from '@/utils/format'

defineProps<{
  cars: Car[]
}>()

defineEmits<{
  edit: [carId: string]
  remove: [carId: string]
}>()

const { t, locale } = useI18n()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table-base w-full min-w-[860px] text-left">
      <thead class="text-xs uppercase tracking-[0.18em]">
        <tr>
          <th class="py-4 pr-4">{{ t('nav.cars') }}</th>
          <th class="py-4 pr-4">VIN</th>
          <th class="py-4 pr-4">{{ t('search.vehicleClass') }}</th>
          <th class="py-4 pr-4">{{ t('common.location') }}</th>
          <th class="py-4 pr-4">{{ t('common.currentStatus') }}</th>
          <th class="py-4 pr-4">{{ locale === 'ru' ? 'Пробег' : 'Mileage' }}</th>
          <th class="py-4 text-right">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="car in cars" :key="car.id">
          <td class="py-4 pr-4">
            <p class="font-medium text-foreground">{{ car.make }} {{ car.model }}</p>
            <p class="text-sm text-muted-foreground">{{ car.plateNumber }} • {{ car.year }}</p>
          </td>
          <td class="py-4 pr-4 text-sm text-muted-foreground">{{ car.vin }}</td>
          <td class="py-4 pr-4 text-sm text-foreground">{{ humanizeEnum(car.carClass) }}</td>
          <td class="py-4 pr-4 text-sm text-foreground">{{ car.location }}</td>
          <td class="py-4 pr-4"><StatusBadge :status="car.status" size="sm" /></td>
          <td class="py-4 pr-4 text-sm text-foreground">
            {{ car.odometerKm.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US') }} km
          </td>
          <td class="py-4 text-right">
            <div class="flex justify-end gap-2">
              <button class="btn-secondary px-3" type="button" @click="$emit('edit', car.id)">
                <Pencil class="h-4 w-4" />
              </button>
              <button class="btn-secondary px-3 text-danger" type="button" @click="$emit('remove', car.id)">
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
