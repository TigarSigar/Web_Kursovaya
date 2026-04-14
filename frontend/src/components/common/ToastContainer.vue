<script setup lang="ts">
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
</script>

<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
    <transition-group name="toast">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        class="pointer-events-auto rounded-2xl border border-border bg-white/95 p-4 shadow-soft backdrop-blur"
      >
        <div class="flex items-start gap-3">
          <span
            class="mt-1 h-2.5 w-2.5 rounded-full"
            :class="{
              'bg-success': toast.type === 'success',
              'bg-danger': toast.type === 'error',
              'bg-primary': toast.type === 'info',
            }"
          />
          <div class="flex-1">
            <p class="text-sm font-semibold text-foreground">{{ toast.title }}</p>
            <p v-if="toast.message" class="mt-1 text-sm text-muted-foreground">{{ toast.message }}</p>
          </div>
          <button class="text-sm text-muted-foreground" @click="uiStore.removeToast(toast.id)">×</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>
