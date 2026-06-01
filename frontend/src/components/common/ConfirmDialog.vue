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
    <div v-if="props.open" class="fixed inset-0 z-[90] flex items-center justify-center bg-[#04050d]/80 px-4 backdrop-blur-md">
      <div class="w-full max-w-md rounded-[28px] border border-white/8 bg-[#0b0b15] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <h3 class="text-lg font-semibold text-white">{{ props.title }}</h3>
        <p class="mt-2 text-sm leading-7 text-white/55">{{ props.description }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <button class="btn-secondary" type="button" @click="close">{{ props.cancelLabel || t('common.cancel') }}</button>
          <button
            class="btn-primary"
            :class="{ '!bg-danger !shadow-none hover:!scale-100': props.danger }"
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
