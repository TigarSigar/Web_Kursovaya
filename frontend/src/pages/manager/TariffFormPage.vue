<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TariffFormSection from '@/components/tariffs/TariffFormSection.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useI18n } from '@/i18n'
import { useTariffsStore } from '@/store/tariffs'
import { useUiStore } from '@/store/ui'
import type { TariffFormModel } from '@/types/entities'

const route = useRoute()
const router = useRouter()
const tariffsStore = useTariffsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const tariffId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))
const isEdit = computed(() => Boolean(tariffId.value))
const copy = computed(() =>
  locale.value === 'ru'
    ? {
        title: isEdit.value ? 'Редактирование тарифа' : 'Добавление тарифа',
        subtitle: 'Описание и ограничения тарифа используются в расчёте и деталях аренды.',
        saved: isEdit.value ? 'Тариф обновлён' : 'Тариф создан',
        failed: 'Не удалось сохранить тариф',
      }
    : {
        title: isEdit.value ? 'Edit tariff' : 'Add tariff',
        subtitle: 'Tariff description and restrictions are used directly in pricing and rental details.',
        saved: isEdit.value ? 'Tariff updated' : 'Tariff created',
        failed: 'Unable to save tariff',
      },
)

const form = ref<TariffFormModel>({
  name: '',
  carClass: 'ECONOMY',
  basePrice: 0,
  dailyPrice: 0,
  minimumDays: 1,
  mileageLimitKm: 200,
  depositAmount: 0,
  insuranceIncluded: true,
  restrictionsText: '',
  description: '',
})

onMounted(async () => {
  await tariffsStore.fetchAll()
  const current = tariffId.value ? tariffsStore.byId(tariffId.value) : null
  if (current) {
    form.value = {
      name: current.name,
      carClass: current.carClass,
      basePrice: current.basePrice,
      dailyPrice: current.dailyPrice,
      minimumDays: current.minimumDays,
      mileageLimitKm: current.mileageLimitKm,
      depositAmount: current.depositAmount,
      insuranceIncluded: current.insuranceIncluded,
      restrictionsText: current.restrictions.join('\n'),
      description: current.description,
    }
  }
})

async function submit() {
  try {
    await tariffsStore.save(tariffId.value || null, {
      name: form.value.name,
      carClass: form.value.carClass,
      basePrice: form.value.basePrice,
      dailyPrice: form.value.dailyPrice,
      minimumDays: form.value.minimumDays,
      mileageLimitKm: form.value.mileageLimitKm,
      depositAmount: form.value.depositAmount,
      insuranceIncluded: form.value.insuranceIncluded,
      restrictions: form.value.restrictionsText.split('\n').map((item) => item.trim()).filter(Boolean),
      description: form.value.description,
    })
    uiStore.pushToast({ type: 'success', title: copy.value.saved })
    router.push('/manager/tariffs')
  } catch (error) {
    uiStore.pushToast({
      type: 'error',
      title: copy.value.failed,
      message: error instanceof Error ? error.message : locale.value === 'ru' ? 'Неизвестная ошибка.' : 'Unknown error.',
    })
  }
}
</script>

<template>
  <section>
    <div class="page-header">
      <div>
        <p class="page-kicker">Tariff form</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <ErrorState v-if="tariffsStore.error" :message="tariffsStore.error" @retry="tariffsStore.fetchAll" />

    <div v-else class="card-base p-6">
      <TariffFormSection v-model="form" />
      <div class="mt-6 flex gap-3">
        <button class="btn-secondary" type="button" @click="router.push('/manager/tariffs')">{{ locale === 'ru' ? 'Назад' : 'Back' }}</button>
        <button class="btn-primary" type="button" @click="submit">{{ locale === 'ru' ? 'Сохранить' : 'Save' }}</button>
      </div>
    </div>
  </section>
</template>
