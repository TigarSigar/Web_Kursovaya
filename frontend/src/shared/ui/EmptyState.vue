<script setup lang="ts">
defineProps<{
  title: string
  description: string
  actionLabel?: string
}>()

defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="card-base flex flex-col items-center justify-center px-5 py-10 text-center">
    <div class="mb-3 rounded-xl bg-primary/15 p-3 text-primary">
      <slot name="icon">.</slot>
    </div>
    <h3 class="text-lg font-semibold text-foreground">{{ title }}</h3>
    <p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{{ description }}</p>
    <button v-if="actionLabel" class="btn-primary mt-5" type="button" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>
