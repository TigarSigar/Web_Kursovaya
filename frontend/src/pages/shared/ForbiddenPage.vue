<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '@/i18n'

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center text-center">
    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-danger">403</p>
    <h1 class="mt-4 text-4xl font-semibold text-foreground">{{ t('errors.403Title') }}</h1>
    <p class="mt-4 max-w-xl text-base text-muted-foreground">
      {{ t('errors.403Text') }}
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <RouterLink class="btn-primary" to="/login">{{ t('errors.goLogin') }}</RouterLink>
      <RouterLink class="btn-secondary" to="/client">{{ t('errors.goClient') }}</RouterLink>
    </div>
  </section>
</template>
