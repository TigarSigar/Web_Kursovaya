<script setup lang="ts">
import { CheckCircle2, Eye, Play } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import type { RentalOrder } from '@/types/entities'
import { formatDate } from '@/utils/date'
import { formatCurrency } from '@/utils/format'
import StatusBadge from '@/shared/ui/StatusBadge.vue'

defineProps<{
  rentals: RentalOrder[]
}>()

defineEmits<{
  open: [rentalId: string]
  issue: [rentalId: string]
  complete: [rentalId: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table-base w-full min-w-[920px] text-left">
      <thead class="text-xs uppercase tracking-[0.18em]">
        <tr>
          <th class="py-4 pr-4">{{ t('common.order') }}</th>
          <th class="py-4 pr-4">{{ t('common.client') }}</th>
          <th class="py-4 pr-4">{{ t('common.period') }}</th>
          <th class="py-4 pr-4">{{ t('common.car') }}</th>
          <th class="py-4 pr-4">{{ t('common.currentStatus') }}</th>
          <th class="py-4 pr-4">{{ t('common.total') }}</th>
          <th class="py-4 text-right">{{ t('common.actions') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rental in rentals" :key="rental.id">
          <td class="py-4 pr-4">
            <p class="font-medium text-foreground">{{ rental.id }}</p>
            <p class="text-sm text-muted-foreground">{{ rental.tariff?.name }}</p>
          </td>
          <td class="py-4 pr-4">
            <p class="font-medium text-foreground">{{ rental.client?.firstName }} {{ rental.client?.lastName }}</p>
            <p class="text-sm text-muted-foreground">{{ rental.client?.email }}</p>
          </td>
          <td class="py-4 pr-4 text-sm text-foreground">{{ formatDate(rental.from) }} - {{ formatDate(rental.to) }}</td>
          <td class="py-4 pr-4">
            <p class="font-medium text-foreground">{{ rental.car?.make }} {{ rental.car?.model }}</p>
            <p class="text-sm text-muted-foreground">{{ rental.car?.plateNumber }}</p>
          </td>
          <td class="py-4 pr-4"><StatusBadge :status="rental.status" size="sm" /></td>
          <td class="py-4 pr-4 font-medium text-foreground">{{ formatCurrency(rental.totalPrice) }}</td>
          <td class="py-4 text-right">
            <div class="flex justify-end gap-2">
              <button class="btn-secondary px-3" type="button" @click="$emit('open', rental.id)">
                <Eye class="h-4 w-4" />
              </button>
              <button
                v-if="['CREATED', 'CONFIRMED'].includes(rental.status)"
                class="btn-primary px-3"
                type="button"
                @click="$emit('issue', rental.id)"
              >
                <Play class="h-4 w-4" />
              </button>
              <button
                v-if="rental.status === 'ISSUED'"
                class="btn-primary px-3"
                type="button"
                @click="$emit('complete', rental.id)"
              >
                <CheckCircle2 class="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
