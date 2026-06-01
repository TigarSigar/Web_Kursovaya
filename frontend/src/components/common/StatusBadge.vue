<script setup lang="ts">
import { computed } from 'vue'
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

const variantMap: Record<string, string> = {
  AVAILABLE: 'status-badge--success',
  RENTED: 'status-badge--warning',
  MAINTENANCE: 'status-badge--muted',
  INACTIVE: 'status-badge--inactive',
  CREATED: 'status-badge--primary',
  CONFIRMED: 'status-badge--info',
  ISSUED: 'status-badge--success',
  COMPLETED: 'status-badge--neutral',
  CANCELLED: 'status-badge--danger',
  SCHEDULED: 'status-badge--primary',
  IN_PROGRESS: 'status-badge--warning',
}

const badgeClass = computed(() => ['status-badge', variantMap[props.status], `status-badge--${props.size}`])
</script>

<template>
  <span :class="badgeClass">
    {{ humanizeEnum(props.status) }}
  </span>
</template>

<style scoped lang="scss">
.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 12px;
  font-weight: 600;
  border: 1px solid transparent;

  &--sm {
    font-size: 12px;
  }

  &--md {
    font-size: 14px;
  }

  &--success {
    color: rgb(var(--color-success));
    background: rgba(var(--color-success), 0.12);
    border-color: rgba(var(--color-success), 0.24);
  }

  &--warning {
    color: rgb(var(--color-warning));
    background: rgba(var(--color-warning), 0.12);
    border-color: rgba(var(--color-warning), 0.24);
  }

  &--danger {
    color: rgb(var(--color-danger));
    background: rgba(var(--color-danger), 0.12);
    border-color: rgba(var(--color-danger), 0.24);
  }

  &--primary {
    color: rgb(var(--color-primary));
    background: rgba(var(--color-primary), 0.12);
    border-color: rgba(var(--color-primary), 0.24);
  }

  &--info {
    color: rgb(56, 189, 248);
    background: rgba(56, 189, 248, 0.12);
    border-color: rgba(56, 189, 248, 0.24);
  }

  &--muted {
    color: var(--text-soft);
    background: var(--surface-glass-strong);
    border-color: var(--border-subtle);
  }

  &--inactive,
  &--neutral {
    color: var(--text-muted);
    background: var(--surface-glass);
    border-color: var(--border-subtle);
  }
}
</style>
