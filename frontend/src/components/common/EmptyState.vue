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
  <div class="card-base flex flex-col items-center justify-center px-6 py-12 text-center">
    <div class="mb-4 rounded-2xl bg-primary/15 p-4 text-primary">
      <slot name="icon">.</slot>
    </div>
    <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
    <p class="mt-2 max-w-md text-sm leading-7 text-white/55">{{ description }}</p>
    <button
      v-if="actionLabel"
      class="btn-primary mt-6"
      type="button"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
