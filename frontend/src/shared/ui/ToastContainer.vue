<script setup lang="ts">
import { useUiStore } from '@/app/stores/ui'

const uiStore = useUiStore()
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div v-for="toast in uiStore.toasts" :key="toast.id" class="toast-container__item">
        <div class="toast-container__content">
          <span
            class="toast-container__dot"
            :class="{
              'toast-container__dot--success': toast.type === 'success',
              'toast-container__dot--error': toast.type === 'error',
              'toast-container__dot--info': toast.type === 'info',
            }"
          />
          <div class="toast-container__text">
            <p class="toast-container__title">{{ toast.title }}</p>
            <p v-if="toast.message" class="toast-container__message">{{ toast.message }}</p>
          </div>
          <button class="toast-container__close" @click="uiStore.removeToast(toast.id)">×</button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  width: min(100%, 24rem);
  flex-direction: column;
  gap: var(--space-3);
  pointer-events: none;

  &__item {
    pointer-events: auto;
    padding: var(--space-4);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--surface-toast);
    box-shadow: var(--shadow-panel);
    backdrop-filter: blur(18px);
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  &__dot {
    flex: none;
    width: 10px;
    height: 10px;
    margin-top: 6px;
    border-radius: var(--radius-sm);

    &--success {
      background: rgb(var(--color-success));
    }

    &--error {
      background: rgb(var(--color-error));
    }

    &--info {
      background: rgb(var(--color-accent));
    }
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 15px;
    font-weight: 700;
    color: rgb(var(--color-text-primary));
  }

  &__message {
    margin-top: 4px;
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    color: var(--text-muted);
  }

  &__close {
    flex: none;
    font-size: 24px;
    line-height: 1;
    color: var(--text-muted);
    transition: color var(--duration-fast) var(--ease-standard);

    &:hover {
      color: rgb(var(--color-text-primary));
    }
  }
}

@media (max-width: 640px) {
  .toast-container {
    left: var(--space-4);
    right: var(--space-4);
    width: auto;
  }
}
</style>
