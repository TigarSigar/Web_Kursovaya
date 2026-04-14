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
      <div class="mt-1 h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(139,92,246,0.55)]" />
      <div class="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="font-semibold text-white">{{ humanizeEnum(item.status) }}</p>
          <p class="text-xs text-white/40">{{ formatDateTime(item.changedAt) }}</p>
        </div>
        <p class="mt-1 text-sm text-white/45">{{ t('common.actorRole') }}: {{ humanizeEnum(item.actorRole) }}</p>
        <p v-if="item.note" class="mt-2 text-sm text-white">{{ item.note }}</p>
      </div>
    </li>
  </ol>
</template>
