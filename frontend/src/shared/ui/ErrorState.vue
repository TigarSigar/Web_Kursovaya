<script setup lang="ts">
import { useI18n } from '@/i18n'

defineProps<{
  title?: string
  message: string
}>()

defineEmits<{
  retry: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="rounded-xl border border-danger/25 bg-danger/10 p-6 backdrop-blur">
    <p class="text-sm font-semibold text-danger">{{ title ?? 'Unable to load data' }}</p>
    <p class="mt-2 text-sm leading-7 text-muted-foreground">{{ message }}</p>
    <button class="btn-secondary mt-4" type="button" @click="$emit('retry')">{{ t('common.tryAgain') }}</button>
  </div>
</template>
