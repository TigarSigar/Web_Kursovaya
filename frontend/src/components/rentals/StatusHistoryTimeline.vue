<script setup lang="ts">
import { useI18n } from '@/i18n'
import type { RentalStatusHistory } from '@/types/entities'
import { formatDateTime } from '@/utils/date'
import { humanizeEnum } from '@/utils/format'

defineProps<{
  items: RentalStatusHistory[]
}>()

const { t } = useI18n()
</script>

<template>
  <ol class="space-y-4">
    <li v-for="item in items" :key="item.id" class="flex gap-4">
      <div class="mt-1 h-3 w-3 rounded-full bg-primary shadow-glow" />
      <div class="flex-1 rounded-2xl border border-border/50 bg-surface/70 p-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="font-semibold text-foreground">{{ humanizeEnum(item.status) }}</p>
          <p class="text-xs text-faint">{{ formatDateTime(item.changedAt) }}</p>
        </div>
        <p class="mt-1 text-sm text-muted-foreground">
          {{ t('common.actorRole') }}: {{ humanizeEnum(item.actorRole) }}
        </p>
        <p v-if="item.note" class="mt-2 text-sm text-foreground">{{ item.note }}</p>
      </div>
    </li>
  </ol>
</template>
