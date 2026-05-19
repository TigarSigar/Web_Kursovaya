import { getCurrentLocale, getCurrentLocaleCode } from '@/i18n'

const enumLabels = {
  en: {
    AVAILABLE: 'Available',
    RENTED: 'Rented',
    MAINTENANCE: 'Maintenance',
    INACTIVE: 'Inactive',
    CREATED: 'Created',
    CONFIRMED: 'Confirmed',
    ISSUED: 'Issued',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'In progress',
    ECONOMY: 'Economy',
    COMFORT: 'Comfort',
    BUSINESS: 'Business',
    SUV: 'SUV',
    LUXURY: 'Luxury',
    AUTOMATIC: 'Automatic',
    MANUAL: 'Manual',
    PETROL: 'Petrol',
    DIESEL: 'Diesel',
    ELECTRIC: 'Electric',
    HYBRID: 'Hybrid',
    CLIENT: 'Client',
    FLEET_MANAGER: 'Fleet manager',
  },
  ru: {
    AVAILABLE: 'Доступен',
    RENTED: 'В аренде',
    MAINTENANCE: 'Обслуживание',
    INACTIVE: 'Неактивен',
    CREATED: 'Создан',
    CONFIRMED: 'Подтверждён',
    ISSUED: 'Выдан',
    COMPLETED: 'Завершён',
    CANCELLED: 'Отменён',
    SCHEDULED: 'Запланировано',
    IN_PROGRESS: 'В процессе',
    ECONOMY: 'Эконом',
    COMFORT: 'Комфорт',
    BUSINESS: 'Бизнес',
    SUV: 'SUV',
    LUXURY: 'Премиум',
    AUTOMATIC: 'Автомат',
    MANUAL: 'Механика',
    PETROL: 'Бензин',
    DIESEL: 'Дизель',
    ELECTRIC: 'Электро',
    HYBRID: 'Гибрид',
    CLIENT: 'Клиент',
    FLEET_MANAGER: 'Менеджер автопарка',
  },
} as const

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat(getCurrentLocaleCode(), {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat(getCurrentLocaleCode(), {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function humanizeEnum(value: string): string {
  const locale = getCurrentLocale()
  const translated = enumLabels[locale][value as keyof (typeof enumLabels)[typeof locale]]
  if (translated) {
    return translated
  }

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
