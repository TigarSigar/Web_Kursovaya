import type { AppLocale } from '@/i18n'

export interface CarCardDetailsCopy {
  show: string
  hide: string
  vin: string
  mileage: string
  tariff: string
  basePrice: string
  restrictions: string
  notes: string
  noNotes: string
  previousPhoto: string
  nextPhoto: string
}

const COPY_BY_LOCALE: Record<AppLocale, CarCardDetailsCopy> = {
  ru: {
    show: 'Подробнее',
    hide: 'Скрыть детали',
    vin: 'VIN',
    mileage: 'Пробег',
    tariff: 'Тариф',
    basePrice: 'Базовая цена',
    restrictions: 'Ограничения',
    notes: 'Комментарий',
    noNotes: 'Комментарий не указан',
    previousPhoto: 'Предыдущее фото',
    nextPhoto: 'Следующее фото',
  },
  en: {
    show: 'View details',
    hide: 'Hide details',
    vin: 'VIN',
    mileage: 'Mileage',
    tariff: 'Tariff',
    basePrice: 'Base fee',
    restrictions: 'Restrictions',
    notes: 'Notes',
    noNotes: 'No notes provided',
    previousPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
  },
}

export function getCarCardDetailsCopy(locale: AppLocale): CarCardDetailsCopy {
  return COPY_BY_LOCALE[locale]
}
