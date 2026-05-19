<script setup lang="ts">
import { useI18n } from '@/i18n'

const { locale, setLocale, t } = useI18n()
</script>

<template>
  <div class="inline-flex rounded-full border border-border/60 bg-surface/70 p-1">
    <button
      class="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition"
      :class="locale === 'ru' ? 'bg-primary text-primary-foreground shadow-glow' : 'text-muted-foreground'"
      type="button"
      @click="setLocale('ru')"
    >
      {{ t('locale.ru') }}
    </button>
    <button
      class="rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition"
      :class="locale === 'en' ? 'bg-primary text-primary-foreground shadow-glow' : 'text-muted-foreground'"
      type="button"
      @click="setLocale('en')"
    >
      {{ t('locale.en') }}
    </button>
  </div>
</template>
