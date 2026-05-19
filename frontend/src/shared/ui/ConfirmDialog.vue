<script setup lang="ts">
import { useI18n } from '@/i18n'

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
    loading?: boolean
  }>(),
  {
    confirmLabel: '',
    cancelLabel: '',
    danger: false,
    loading: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

const { t } = useI18n()

function close() {
  emit('update:open', false)
}
</script>

<template>
  <teleport to="body">
    <div v-if="props.open" class="confirm-dialog__overlay">
      <div class="confirm-dialog__panel">
        <h3 class="text-lg font-semibold text-foreground">{{ props.title }}</h3>
        <p class="mt-2 text-sm leading-7 text-muted-foreground">{{ props.description }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button class="btn-secondary" type="button" @click="close">
            {{ props.cancelLabel || t('common.cancel') }}
          </button>
          <button
            class="btn-primary"
            :class="{ 'bg-danger text-primary-foreground shadow-none hover:scale-100': props.danger }"
            :disabled="props.loading"
            type="button"
            @click="$emit('confirm')"
          >
            {{ props.loading ? t('common.pleaseWait') : props.confirmLabel || t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped lang="scss">
.confirm-dialog {
  &__overlay {
    position: fixed;
    inset: 0;
    z-index: var(--z-overlay);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-inline: var(--space-4);
    background: rgb(var(--color-overlay) / 0.72);
    backdrop-filter: blur(10px);
  }

  &__panel {
    width: 100%;
    max-width: 28rem;
    padding: var(--space-6);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    background: var(--surface-glass-strong);
    box-shadow: var(--shadow-panel);
  }
}
</style>
