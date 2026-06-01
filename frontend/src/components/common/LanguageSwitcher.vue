<script setup lang="ts">
import { useI18n } from '@/i18n'

const { locale, setLocale, t } = useI18n()
</script>

<template>
  <div class="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1">
    <button
      class="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition"
      :class="locale === 'ru' ? 'bg-primary text-white shadow-[0_0_16px_rgba(139,92,246,0.22)]' : 'text-white/45'"
      type="button"
      @click="setLocale('ru')"
    >
      {{ t('locale.ru') }}
    </button>
    <button
      class="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition"
      :class="locale === 'en' ? 'bg-primary text-white shadow-[0_0_16px_rgba(139,92,246,0.22)]' : 'text-white/45'"
      type="button"
      @click="setLocale('en')"
    >
      {{ t('locale.en') }}
    </button>
  </div>
</template>
