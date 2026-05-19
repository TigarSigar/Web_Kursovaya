import type { AppLocale } from '@/i18n'

export interface PublicHomeCopy {
  titleLine1: string
  titleLine2: string
  titleLine3: string
  titleLine4Prefix: string
  subtitle: string
  explore: string
  about: string
  heroCaption: string
  heroStatFleet: string
  heroStatSupport: string
  heroStatTheme: string
  heroPointLocation: string
  heroPointLocationText: string
  heroPointService: string
  heroPointServiceText: string
  featured: string
  featuredText: string
  view: string
  all: string
  info: string
  infoText: string
  infoLead: string
  infoCardText: string
  why: string
  whyText: string
  insuranceTitle: string
  insuranceText: string
  supportTitle: string
  supportText: string
  priceTitle: string
  priceText: string
  bookingTitle: string
  bookingText: string
  how: string
  howText: string
  howLocationTitle: string
  howLocationText: string
  howDatesTitle: string
  howDatesText: string
  howCarTitle: string
  howCarText: string
  howDriveTitle: string
  howDriveText: string
  request: string
  requestText: string
  requestPrimary: string
  requestSecondary: string
  scheduleTitle: string
  scheduleHours: string
  scheduleText: string
}

const COPY_BY_LOCALE: Record<AppLocale, PublicHomeCopy> = {
  ru: {
    titleLine1: 'Путешествуйте',
    titleLine2: 'с кайфом',
    titleLine3: 'Гордо',
    titleLine4Prefix: 'Выбирайте',
    subtitle:
      'Выбирайте автомобили из широкого каталога, бронируйте онлайн и получайте надёжный сервис без лишних шагов.',
    explore: 'Смотреть автомобили',
    about: 'Как это работает',
    heroCaption: 'Надёжный прокат с быстрым подтверждением и прозрачными условиями.',
    heroStatFleet: 'автомобилей в каталоге',
    heroStatSupport: 'поддержка по заявке',
    heroStatTheme: 'единый интерфейс и темы',
    heroPointLocation: 'Гибкая точка выдачи',
    heroPointLocationText: 'Подберём удобное место передачи автомобиля под маршрут клиента.',
    heroPointService: 'Прозрачные условия',
    heroPointServiceText: 'Стоимость, ограничения и доступность фиксируются до бронирования.',
    featured: 'Наши автомобили',
    featuredText: 'Актуальные машины из каталога, которые уже можно забронировать онлайн.',
    view: 'Подробнее',
    all: 'Все автомобили',
    info: 'Информация и условия',
    infoText:
      'Главная страница теперь собрана как маршрут пользователя: сначала выбор автомобиля, затем условия сервиса, процесс бронирования и финальный переход в каталог.',
    infoLead: 'Сервис аренды без разрыва между витриной и рабочим сценарием бронирования.',
    infoCardText:
      'Подтверждение доступности, прозрачная стоимость, сопровождение по выдаче и возврату, а также единый интерфейс в светлой и тёмной теме.',
    why: 'Почему CarGO',
    whyText: 'Тот же визуальный стиль проекта, но с более собранной структурой и понятным сценарием на первом экране.',
    insuranceTitle: 'Полное покрытие',
    insuranceText: 'Условия защиты и ограничения по аренде показываются до оформления заявки.',
    supportTitle: 'Поддержка 24/7',
    supportText: 'Команда сервиса помогает на этапе бронирования, выдачи и возврата автомобиля.',
    priceTitle: 'Честная цена',
    priceText: 'Без скрытых платежей: базовая цена, тариф и обязательные условия видны заранее.',
    bookingTitle: 'Быстрый переход к бронированию',
    bookingText: 'Поиск на первом экране сразу ведёт в каталог с уже заполненными параметрами.',
    how: 'Как это работает',
    howText: 'Новая композиция усиливает тот же сценарий аренды и делает его читаемым с первого экрана.',
    howLocationTitle: 'Выберите локацию',
    howLocationText: 'Укажите удобную точку выдачи и возврата автомобиля.',
    howDatesTitle: 'Выберите даты',
    howDatesText: 'Проверьте доступность сразу на первом экране без лишних переходов.',
    howCarTitle: 'Сравните автомобили',
    howCarText: 'Откройте карточки машин, изучите параметры и выберите подходящий вариант.',
    howDriveTitle: 'Перейдите к заявке',
    howDriveText: 'Каталог открывается уже с заполненными параметрами поиска.',
    request: 'Онлайн заявка на аренду',
    requestText:
      'Если вы уже определились с поездкой, переходите в каталог и оформляйте бронирование без лишних шагов.',
    requestPrimary: 'Открыть каталог',
    requestSecondary: 'Смотреть процесс',
    scheduleTitle: 'Рабочее время',
    scheduleHours: 'с 9:00 до 19:00',
    scheduleText:
      'Заявки принимаются круглосуточно, подтверждение, выдача и возврат выполняются менеджером в рабочие часы.',
  },
  en: {
    titleLine1: 'Drive',
    titleLine2: 'With Kaif',
    titleLine3: 'and chill',
    titleLine4Prefix: 'Travel with',
    subtitle:
      'Choose from a wide range of cars, book easily online, and enjoy a smooth, reliable driving experience wherever you go.',
    explore: 'Explore Cars',
    about: 'How It Works',
    heroCaption: 'Reliable rental flow with fast confirmation and transparent terms.',
    heroStatFleet: 'cars in catalog',
    heroStatSupport: 'support on each request',
    heroStatTheme: 'consistent themed interface',
    heroPointLocation: 'Flexible pickup point',
    heroPointLocationText: 'We help choose the handoff point that fits the trip.',
    heroPointService: 'Transparent terms',
    heroPointServiceText: 'Price, limits, and availability are clear before booking.',
    featured: 'Our Cars',
    featuredText: 'Live cars from the catalog that are already available for online booking.',
    view: 'View Details',
    all: 'View All Cars',
    info: 'Information and terms',
    infoText:
      'The front page is now arranged as a user flow: first the car choice, then service conditions, booking steps, and the final move into the catalog.',
    infoLead: 'A rental service without a gap between the showcase and the real booking flow.',
    infoCardText:
      'Availability confirmation, transparent pricing, pickup and return support, and a consistent interface in both light and dark themes.',
    why: 'Why CarGO',
    whyText: 'The same project visual language, but with a cleaner structure and a clearer first-screen scenario.',
    insuranceTitle: 'Full Coverage',
    insuranceText: 'Protection terms and rental limitations are visible before the request is sent.',
    supportTitle: '24/7 Support',
    supportText: 'The team helps during booking, pickup, and return.',
    priceTitle: 'Fair Pricing',
    priceText: 'No hidden fees: base price, tariff, and required conditions are visible upfront.',
    bookingTitle: 'Fast path to booking',
    bookingText: 'Search on the first screen opens the catalog with the selected parameters already applied.',
    how: 'How It Works',
    howText: 'The new composition strengthens the same rental flow and makes it readable from the first screen.',
    howLocationTitle: 'Choose location',
    howLocationText: 'Set the pickup and return point that fits your trip.',
    howDatesTitle: 'Choose dates',
    howDatesText: 'Check availability directly on the first screen without extra navigation.',
    howCarTitle: 'Compare cars',
    howCarText: 'Open car cards, review the specs, and choose the right option.',
    howDriveTitle: 'Move to booking',
    howDriveText: 'The catalog opens with the search parameters already filled in.',
    request: 'Online rental request',
    requestText: 'If your trip is already planned, move to the catalog and continue booking without extra steps.',
    requestPrimary: 'Open Catalog',
    requestSecondary: 'See the process',
    scheduleTitle: 'Working hours',
    scheduleHours: '9:00 to 19:00',
    scheduleText:
      'Requests are accepted 24/7, while confirmation, pickup, and return are handled by the manager during working hours.',
  },
}

export function getPublicHomeCopy(locale: AppLocale): PublicHomeCopy {
  return COPY_BY_LOCALE[locale]
}
