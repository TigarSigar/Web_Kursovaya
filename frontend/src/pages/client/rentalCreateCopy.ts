import type { AppLocale } from '@/i18n'

export interface RentalCreateCopy {
  kicker: string
  title: string
  subtitle: string
  unavailableTitle: string
  unavailableText: string
  availabilityError: string
  vehicle: string
  specs: string
  carClass: string
  year: string
  seats: string
  transmission: string
  fuel: string
  location: string
  params: string
  startDate: string
  endDate: string
  pickup: string
  return: string
  tariff: string
  client: string
  fullName: string
  license: string
  restrictions: string
  minimum: string
  insurance: string
  included: string
  excluded: string
  submit: string
  created: string
  createdMessage: string
  failed: string
  prevPhoto: string
  nextPhoto: string
  selectedPhoto: string
  recalculate: string
}

const COPY_BY_LOCALE: Record<AppLocale, RentalCreateCopy> = {
  ru: {
    kicker: 'Оформление аренды',
    title: 'Подтверждение бронирования',
    subtitle: 'Перед созданием заказа доступность автомобиля проверяется повторно.',
    unavailableTitle: 'Оформление недоступно',
    unavailableText: 'Сначала выберите автомобиль и корректный диапазон дат в поиске.',
    availabilityError: 'Автомобиль недоступен на выбранные даты. Измените период аренды.',
    vehicle: 'Автомобиль',
    specs: 'Характеристики автомобиля',
    carClass: 'Класс',
    year: 'Год',
    seats: 'Мест',
    transmission: 'Трансмиссия',
    fuel: 'Топливо',
    location: 'Локация',
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
    prevPhoto: 'Предыдущее фото',
    nextPhoto: 'Следующее фото',
    selectedPhoto: 'Выбранное фото',
    recalculate: 'Даты можно изменить до подтверждения',
  },
  en: {
    kicker: 'Rental creation',
    title: 'Confirm your booking',
    subtitle: 'Vehicle availability is checked again right before the order is created.',
    unavailableTitle: 'Booking unavailable',
    unavailableText: 'Choose a vehicle and valid rental dates in search first.',
    availabilityError: 'Vehicle is unavailable for the selected dates. Adjust the rental period.',
    vehicle: 'Vehicle',
    specs: 'Vehicle specifications',
    carClass: 'Class',
    year: 'Year',
    seats: 'Seats',
    transmission: 'Transmission',
    fuel: 'Fuel',
    location: 'Location',
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
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
    selectedPhoto: 'Selected photo',
    recalculate: 'You can adjust dates before confirming',
  },
}

export function getRentalCreateCopy(locale: AppLocale): RentalCreateCopy {
  return COPY_BY_LOCALE[locale]
}
