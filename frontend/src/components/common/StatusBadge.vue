<script setup lang="ts">
import type { CarStatus, MaintenanceStatus, RentalStatus } from '@/types/entities'
import { humanizeEnum } from '@/utils/format'

const props = withDefaults(
  defineProps<{
    status: CarStatus | RentalStatus | MaintenanceStatus
    size?: 'sm' | 'md'
  }>(),
  {
    size: 'md',
  },
)

const variants: Record<string, string> = {
  AVAILABLE: 'bg-success/15 text-success ring-success/25',
  RENTED: 'bg-warning/15 text-warning ring-warning/25',
  MAINTENANCE: 'bg-white/10 text-white/75 ring-white/15',
  INACTIVE: 'bg-white/6 text-white/45 ring-white/10',
  CREATED: 'bg-primary/15 text-primary ring-primary/25',
  CONFIRMED: 'bg-sky-500/15 text-sky-300 ring-sky-500/25',
  ISSUED: 'bg-success/15 text-success ring-success/25',
  COMPLETED: 'bg-white/10 text-white/70 ring-white/15',
  CANCELLED: 'bg-danger/15 text-danger ring-danger/25',
  SCHEDULED: 'bg-primary/15 text-primary ring-primary/25',
  IN_PROGRESS: 'bg-warning/15 text-warning ring-warning/25',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-full px-3 py-1 font-medium ring-1 ring-inset"
    :class="[variants[props.status], props.size === 'sm' ? 'text-xs' : 'text-sm']"
  >
    {{ humanizeEnum(props.status) }}
  </span>
</template>
