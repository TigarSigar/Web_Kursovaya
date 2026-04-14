<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PriceBreakdown from '@/components/rentals/PriceBreakdown.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import { useI18n } from '@/i18n'
import { useAuthStore } from '@/store/auth'
import { useCarsStore } from '@/store/cars'
import { useRentalsStore } from '@/store/rentals'
import { useTariffsStore } from '@/store/tariffs'
import { useUiStore } from '@/store/ui'
import { humanizeEnum } from '@/utils/format'
import { calculatePriceBreakdown } from '@/utils/price'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const carsStore = useCarsStore()
const tariffsStore = useTariffsStore()
const rentalsStore = useRentalsStore()
const uiStore = useUiStore()
const { locale } = useI18n()

const form = reactive({
  pickupLocation: '',
  returnLocation: '',
  tariffId: '',
})

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Оформление аренды',
        title: 'Подтверждение бронирования',
        subtitle: 'Перед созданием заказа доступность автомобиля проверяется повторно.',
        unavailableTitle: 'Оформление недоступно',
        unavailableText: 'Сначала выберите автомобиль и корректный диапазон дат в поиске.',
        vehicle: 'Автомобиль',
        params: 'Параметры аренды',
        startDate: 'Дата начала',
        endDate: 'Дата окончания',
        pickup: 'Точка выдачи',
        return: 'Точка возврата',
        tariff: 'Тариф',
        client: 'Клиент',
        fullName: 'ФИО',
        license: 'Водительское удостоверение',
        restrictions: 'Ограничения тарифа',
        minimum: 'Минимум',
        insurance: 'Страховка',
        included: 'включена',
        excluded: 'не включена',
        submit: 'Подтвердить аренду',
        created: 'Аренда создана',
        createdMessage: 'Заказ {id} добавлен в список клиента.',
        failed: 'Не удалось оформить аренду',
      }
    : {
        kicker: 'Rental creation',
        title: 'Confirm your booking',
        subtitle: 'Vehicle availability is checked again right before the order is created.',
        unavailableTitle: 'Booking unavailable',
        unavailableText: 'Choose a vehicle and valid rental dates in search first.',
        vehicle: 'Vehicle',
        params: 'Rental details',
        startDate: 'Start date',
        endDate: 'End date',
        pickup: 'Pickup location',
        return: 'Return location',
        tariff: 'Tariff',
        client: 'Client',
        fullName: 'Full name',
        license: 'Driver license',
        restrictions: 'Tariff restrictions',
        minimum: 'Minimum',
        insurance: 'Insurance',
        included: 'included',
        excluded: 'not included',
        submit: 'Confirm rental',
        created: 'Rental created',
        createdMessage: 'Order {id} was added to the client history.',
        failed: 'Unable to create rental',
      },
)

const carId = computed(() => (typeof route.query.carId === 'string' ? route.query.carId : ''))
const from = computed(() => (typeof route.query.from === 'string' ? route.query.from : ''))
const to = computed(() => (typeof route.query.to === 'string' ? route.query.to : ''))

const selectedCar = computed(() => carsStore.byId(carId.value))
const compatibleTariffs = computed(() =>
  selectedCar.value ? tariffsStore.byClass(selectedCar.value.carClass) : [],
)
const selectedTariff = computed(() => compatibleTariffs.value.find((item) => item.id === form.tariffId) ?? compatibleTariffs.value[0] ?? null)
const breakdown = computed(() => (selectedTariff.value && from.value && to.value ? calculatePriceBreakdown(selectedTariff.value, from.value, to.value) : null))
const blockingResult = computed(() => carsStore.searchResults.find((item) => item.car.id === carId.value))

onMounted(async () => {
  await Promise.all([carsStore.fetchAll(), tariffsStore.fetchAll()])
  if (from.value && to.value) {
    await carsStore.searchAvailable({ from: from.value, to: to.value })
  }
  if (selectedCar.value) {
    form.pickupLocation = selectedCar.value.location
    form.returnLocation = selectedCar.value.location
    form.tariffId = compatibleTariffs.value[0]?.id ?? ''
  }
})

async function submit() {
  if (!authStore.currentClientProfile || !selectedCar.value || !selectedTariff.value || !from.value || !to.value) {
    return
  }

  try {
    const rental = await rentalsStore.create({
      clientId: authStore.currentClientProfile.id,
      carId: selectedCar.value.id,
      tariffId: selectedTariff.value.id,
      from: from.value,
      to: to.value,
      pickupLocation: form.pickupLocation,
      returnLocation: form.returnLocation,
    })
    uiStore.pushToast({
      type: 'success',
      title: copy.value.created,
      message: copy.value.createdMessage.replace('{id}', rental.id),
    })
    router.push(`/client/rentals/${rental.id}`)
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
        <p class="page-kicker">{{ copy.kicker }}</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <ErrorState
      v-if="!selectedCar || !selectedTariff || !from || !to || blockingResult?.available === false"
      :title="copy.unavailableTitle"
      :message="blockingResult?.reasons?.[0] ?? copy.unavailableText"
      @retry="router.push('/client/search')"
    />

    <div v-else class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-6">
        <article class="card-base p-6">
          <p class="text-sm font-semibold uppercase tracking-[0.28em] text-primary">{{ copy.vehicle }}</p>
          <h2 class="mt-3 text-2xl font-semibold text-foreground">{{ selectedCar.make }} {{ selectedCar.model }}</h2>
          <p class="mt-2 text-sm text-muted-foreground">{{ selectedCar.plateNumber }} • {{ humanizeEnum(selectedCar.carClass) }} • {{ selectedCar.location }}</p>
        </article>

        <article class="card-base p-6">
          <h2 class="text-lg font-semibold text-foreground">{{ copy.params }}</h2>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <label class="field-group">
              <span class="field-label">{{ copy.startDate }}</span>
              <input class="input-base" type="date" :value="from" disabled />
            </label>
            <label class="field-group">
              <span class="field-label">{{ copy.endDate }}</span>
              <input class="input-base" type="date" :value="to" disabled />
            </label>
            <label class="field-group">
              <span class="field-label">{{ copy.pickup }}</span>
              <input v-model="form.pickupLocation" class="input-base" />
            </label>
            <label class="field-group">
              <span class="field-label">{{ copy.return }}</span>
              <input v-model="form.returnLocation" class="input-base" />
            </label>
            <label class="field-group md:col-span-2">
              <span class="field-label">{{ copy.tariff }}</span>
              <select v-model="form.tariffId" class="input-base">
                <option v-for="tariff in compatibleTariffs" :key="tariff.id" :value="tariff.id">
                  {{ tariff.name }} • {{ tariff.dailyPrice }} ₽
                </option>
              </select>
            </label>
          </div>
        </article>

        <article class="card-base p-6">
          <h2 class="text-lg font-semibold text-foreground">{{ copy.client }}</h2>
          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.fullName }}</p>
              <p class="mt-1 font-medium text-foreground">{{ authStore.currentClientProfile?.firstName }} {{ authStore.currentClientProfile?.lastName }}</p>
            </div>
            <div class="rounded-2xl bg-white/[0.03] p-4">
              <p class="text-sm text-white/45">{{ copy.license }}</p>
              <p class="mt-1 font-medium text-foreground">{{ authStore.currentClientProfile?.driverLicenseNumber }}</p>
            </div>
          </div>
        </article>
      </div>

      <div class="space-y-6">
        <PriceBreakdown v-if="breakdown" :breakdown="breakdown" :tariff="selectedTariff" />
        <article class="card-base p-6">
          <h2 class="text-lg font-semibold text-foreground">{{ copy.restrictions }}</h2>
          <ul class="mt-4 space-y-2 text-sm text-muted-foreground">
            <li v-for="restriction in selectedTariff.restrictions" :key="restriction">• {{ restriction }}</li>
            <li>• {{ copy.minimum }} {{ selectedTariff.minimumDays }} {{ locale === 'ru' ? 'суток' : 'days' }}</li>
            <li>• {{ copy.insurance }} {{ selectedTariff.insuranceIncluded ? copy.included : copy.excluded }}</li>
          </ul>
        </article>
        <button class="btn-primary w-full justify-center" type="button" @click="submit">{{ copy.submit }}</button>
      </div>
    </div>
  </section>
</template>
