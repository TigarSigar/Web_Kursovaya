<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronDown, Fuel, Settings2, Users } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import type { AvailableCarResult, Car } from '@/types/entities'
import { formatCurrency, humanizeEnum } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge.vue'

const props = withDefaults(
  defineProps<{
    car: Car
    result?: AvailableCarResult
    actionLabel?: string
    actionTo?: string
    theme?: 'light' | 'dark'
  }>(),
  {
    theme: 'dark',
  },
)

const { t, locale } = useI18n()
const expanded = ref(false)

const primaryTariff = computed(() => props.result?.tariffs[0] ?? null)
const detailCopy = computed(() =>
  locale.value === 'ru'
    ? {
        show: 'Подробнее',
        hide: 'Скрыть детали',
        vin: 'VIN',
        mileage: 'Пробег',
        tariff: 'Тариф',
        basePrice: 'Базовая цена',
        restrictions: 'Ограничения',
        notes: 'Комментарий',
        noNotes: 'Комментарий не указан',
      }
    : {
        show: 'View details',
        hide: 'Hide details',
        vin: 'VIN',
        mileage: 'Mileage',
        tariff: 'Tariff',
        basePrice: 'Base fee',
        restrictions: 'Restrictions',
        notes: 'Notes',
        noNotes: 'No notes provided',
      },
)

function toggleExpanded() {
  expanded.value = !expanded.value
}
</script>

<template>
  <article
    class="overflow-hidden rounded-[28px] border"
    :class="theme === 'dark' ? 'border-white/8 bg-white/[0.03] backdrop-blur' : 'card-base'"
  >
    <div
      class="relative cursor-pointer p-5"
      :class="theme === 'dark' ? 'border-b border-white/8 bg-gradient-to-br from-white/[0.03] via-[#151525] to-[#0f1020]' : 'border-b border-border bg-gradient-to-br from-primary/8 via-white to-slate-100'"
      @click="toggleExpanded"
    >
      <img :src="car.imageUrl || '/car-placeholder.svg'" alt="" class="h-52 w-full rounded-2xl object-cover lg:h-60" />
      <div class="absolute right-8 top-8">
        <StatusBadge :status="result?.available === true ? 'AVAILABLE' : car.status" size="sm" />
      </div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{{ humanizeEnum(car.carClass) }}</p>
          <h3 class="mt-1 text-xl font-semibold" :class="theme === 'dark' ? 'text-white' : 'text-foreground'">{{ car.make }} {{ car.model }}</h3>
          <p class="text-sm" :class="theme === 'dark' ? 'text-white/45' : 'text-muted-foreground'">{{ car.year }} • {{ car.plateNumber }}</p>
        </div>
        <div class="rounded-2xl px-3 py-2 text-right" :class="theme === 'dark' ? 'bg-white/[0.04]' : 'bg-slate-100'">
          <p class="text-xs" :class="theme === 'dark' ? 'text-white/40' : 'text-muted-foreground'">{{ t('common.currentStatus') }}</p>
          <p class="text-sm font-medium" :class="theme === 'dark' ? 'text-white' : 'text-foreground'">{{ humanizeEnum(car.status) }}</p>
        </div>
      </div>

      <div class="mt-5 grid grid-cols-3 gap-3 text-sm" :class="theme === 'dark' ? 'text-white/50' : 'text-muted-foreground'">
        <div class="rounded-2xl p-3" :class="theme === 'dark' ? 'bg-white/[0.03]' : 'bg-slate-50'">
          <Users class="mb-2 h-4 w-4 text-primary" />
          {{ car.seats }} {{ t('common.seats') }}
        </div>
        <div class="rounded-2xl p-3" :class="theme === 'dark' ? 'bg-white/[0.03]' : 'bg-slate-50'">
          <Settings2 class="mb-2 h-4 w-4 text-primary" />
          {{ humanizeEnum(car.transmission) }}
        </div>
        <div class="rounded-2xl p-3" :class="theme === 'dark' ? 'bg-white/[0.03]' : 'bg-slate-50'">
          <Fuel class="mb-2 h-4 w-4 text-primary" />
          {{ humanizeEnum(car.fuelType) }}
        </div>
      </div>

      <div class="mt-5 flex items-center justify-between gap-3 pt-4" :class="theme === 'dark' ? 'border-t border-white/8' : 'border-t border-border'">
        <div>
          <p class="text-sm" :class="theme === 'dark' ? 'text-white/40' : 'text-muted-foreground'">{{ t('common.location') }}</p>
          <p class="font-medium" :class="theme === 'dark' ? 'text-white' : 'text-foreground'">{{ car.location }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm" :class="theme === 'dark' ? 'text-white/40' : 'text-muted-foreground'">{{ t('common.from') }}</p>
          <p class="text-lg font-semibold" :class="theme === 'dark' ? 'text-white' : 'text-foreground'">
            {{ formatCurrency(primaryTariff?.dailyPrice ?? 0) }}<span class="text-sm font-normal" :class="theme === 'dark' ? 'text-white/40' : 'text-muted-foreground'"> {{ t('common.perDay') }}</span>
          </p>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap gap-3">
        <button
          class="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
          type="button"
          @click.stop="toggleExpanded"
        >
          {{ expanded ? detailCopy.hide : detailCopy.show }}
          <ChevronDown class="h-4 w-4 transition" :class="{ 'rotate-180': expanded }" />
        </button>

        <RouterLink
          v-if="actionTo"
          class="flex flex-1 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition"
          :class="theme === 'dark' ? 'bg-gradient-to-r from-primary to-[#8b5cf6] text-white shadow-[0_0_24px_rgba(139,92,246,0.25)]' : 'btn-primary'"
          :to="actionTo"
          @click.stop
        >
          {{ actionLabel ?? t('common.open') }}
        </RouterLink>
      </div>

      <transition name="toast">
        <div v-if="expanded" class="mt-5 border-t border-white/8 pt-5">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-white/40">{{ detailCopy.vin }}</p>
              <p class="mt-2 text-sm font-medium text-white">{{ car.vin }}</p>
            </div>
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-white/40">{{ detailCopy.mileage }}</p>
              <p class="mt-2 text-sm font-medium text-white">{{ car.odometerKm.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US') }} km</p>
            </div>
            <div v-if="primaryTariff" class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-white/40">{{ detailCopy.tariff }}</p>
              <p class="mt-2 text-sm font-medium text-white">{{ primaryTariff.name }}</p>
              <p class="mt-2 text-sm text-white/55">{{ detailCopy.basePrice }}: {{ formatCurrency(primaryTariff.basePrice) }}</p>
            </div>
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-white/40">{{ detailCopy.notes }}</p>
              <p class="mt-2 text-sm text-white/70">{{ car.notes || detailCopy.noNotes }}</p>
            </div>
          </div>

          <div v-if="primaryTariff?.restrictions?.length" class="mt-4 rounded-2xl bg-white/[0.03] p-4">
            <p class="text-xs uppercase tracking-[0.16em] text-white/40">{{ detailCopy.restrictions }}</p>
            <ul class="mt-3 space-y-2 text-sm text-white/70">
              <li v-for="restriction in primaryTariff.restrictions" :key="restriction">• {{ restriction }}</li>
            </ul>
          </div>
        </div>
      </transition>

      <div v-if="result && !result.available" class="mt-4 rounded-2xl bg-danger/10 p-4 text-sm text-danger">
        <p class="font-medium">{{ t('common.unavailableSelectedDates') }}</p>
        <ul class="mt-2 space-y-1">
          <li v-for="reason in result.reasons" :key="reason">• {{ reason }}</li>
        </ul>
      </div>
    </div>
  </article>
</template>
