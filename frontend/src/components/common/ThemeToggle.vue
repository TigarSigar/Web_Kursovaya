<script setup lang="ts">
import { computed } from 'vue'
import { MoonStar, SunMedium } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
const { locale } = useI18n()

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const label = computed(() =>
  locale.value === 'ru'
    ? uiStore.theme === 'dark'
      ? 'Светлая тема'
      : 'Тёмная тема'
    : uiStore.theme === 'dark'
      ? 'Light theme'
      : 'Dark theme',
)
</script>

<template>
  <button
    class="btn-secondary !rounded-full"
    :class="compact ? '!px-3 !py-2 text-xs' : '!px-4 !py-3'"
    type="button"
    :title="label"
    :aria-label="label"
    @click="uiStore.toggleTheme()"
  >
    <SunMedium v-if="uiStore.theme === 'dark'" class="h-4 w-4" />
    <MoonStar v-else class="h-4 w-4" />
    <span class="hidden md:inline" :class="compact ? 'text-xs' : ''">{{ label }}</span>
  </button>
</template>
