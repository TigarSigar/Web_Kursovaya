<script setup lang="ts">
import { useUiStore } from '@/store/ui'

const uiStore = useUiStore()
</script>

<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in uiStore.toasts"
        :key="toast.id"
        class="toast-container__item"
      >
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
  top: 16px;
  right: 16px;
  z-index: 100;
  display: flex;
  width: min(100%, 384px);
  flex-direction: column;
  gap: 12px;
  pointer-events: none;

  &__item {
    pointer-events: auto;
    padding: 16px;
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    background: var(--surface-toast);
    box-shadow: var(--shadow-panel);
    backdrop-filter: blur(18px);
  }

  &__content {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  &__dot {
    flex: none;
    width: 10px;
    height: 10px;
    margin-top: 6px;
    border-radius: 999px;

    &--success {
      background: rgb(var(--color-success));
    }

    &--error {
      background: rgb(var(--color-danger));
    }

    &--info {
      background: rgb(var(--color-primary));
    }
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 15px;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }

  &__message {
    margin-top: 4px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--text-muted);
  }

  &__close {
    flex: none;
    font-size: 24px;
    line-height: 1;
    color: var(--text-muted);
    transition: color 0.2s ease;

    &:hover {
      color: rgb(var(--color-foreground));
    }
  }
}

@media (max-width: 640px) {
  .toast-container {
    left: 16px;
    width: auto;
  }
}
</style>
