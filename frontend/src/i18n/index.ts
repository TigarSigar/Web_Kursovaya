import { readonly, ref } from 'vue'

export type AppLocale = 'ru' | 'en'

const STORAGE_KEY = 'cargo-locale'

const messages: Record<AppLocale, Record<string, string>> = {
  en: {
    'locale.ru': 'Ru',
    'locale.en': 'En',
    'nav.home': 'Home',
    'nav.cars': 'Cars',
    'nav.howItWorks': 'How It Works',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.account': 'Account',
    'nav.bookNow': 'Book Now',
    'nav.myRentals': 'My Rentals',
    'nav.dashboard': 'Dashboard',
    'nav.tariffs': 'Tariffs',
    'nav.maintenance': 'Maintenance',
    'nav.rentals': 'Rentals',
    'nav.logout': 'Log Out',
    'search.pickupLocation': 'Pickup Location',
    'search.anyLocation': 'Any location',
    'search.vehicleClass': 'Vehicle Class',
    'search.anyClass': 'Any class',
    'search.pickupDate': 'Pickup Date',
    'search.returnDate': 'Return Date',
    'search.rangeError': 'Return date must be later than pickup date.',
    'search.availabilityVerified': 'Availability verified',
    'search.instantConfirmation': 'Instant confirmation',
    'search.noHiddenFees': 'No hidden fees',
    'search.submit': 'Search',
    'common.tryAgain': 'Try Again',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.pleaseWait': 'Please wait...',
    'common.back': 'Back',
    'common.save': 'Save',
    'common.open': 'Open',
    'common.details': 'Details',
    'common.edit': 'Edit',
    'common.remove': 'Remove',
    'common.all': 'All',
    'common.active': 'Active',
    'common.history': 'History',
    'common.order': 'Order',
    'common.days': 'days',
    'common.total': 'Total',
    'common.from': 'From',
    'common.location': 'Location',
    'common.seats': 'seats',
    'common.perDay': '/ day',
    'common.currentStatus': 'Current status',
    'common.unavailableSelectedDates': 'Unavailable for selected dates',
    'common.actorRole': 'Actor role',
    'rental.priceBreakdown': 'Price breakdown',
    'rental.selectedTariff': 'Selected tariff',
    'rental.baseFee': 'Base fee',
    'rental.total': 'Total',
    'auth.signIn': 'Sign in',
    'auth.accessAccount': 'Access your account',
    'auth.chooseWorkspace': 'Choose your workspace and continue to the appropriate portal.',
    'auth.clientPortal': 'Client Portal',
    'auth.fleetDesk': 'Fleet Desk',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.continue': 'Continue',
    'auth.createAccount': 'Create account',
    'auth.noAccount': "Don't have an account?",
    'auth.haveAccount': 'Already have an account?',
    'auth.registerTitle': 'Create your account',
    'auth.registerSubtitle': 'Start with a client account and access booking, rentals, and status tracking.',
    'auth.fullName': 'Full name',
    'auth.phone': 'Phone',
    'auth.goRegister': 'Register',
    'auth.goLogin': 'Sign in',
    'auth.heroTitle': 'Premium access to your rentals, fleet and bookings.',
    'auth.heroSubtitle': 'Sign in to manage reservations, process vehicle handovers and keep fleet availability under control.',
    'auth.availabilityControl': 'Availability control',
    'auth.availabilityDesc': 'Bookings are verified against maintenance windows and overlapping rentals.',
    'auth.operationalWorkflow': 'Operational workflow',
    'auth.operationalDesc': 'Issue and complete rentals with status history and return time tracking.',
    'errors.403Title': 'Access forbidden',
    'errors.403Text': 'This page is intended for another role. Client and manager areas are separated by route permissions.',
    'errors.404Title': 'Page not found',
    'errors.404Text': 'The route does not exist or has been moved. Use the main navigation to continue.',
    'errors.goLogin': 'Go to login',
    'errors.goClient': 'Open client area',
  },
  ru: {
    'locale.ru': 'Ru',
    'locale.en': 'En',
    'nav.home': 'Главная',
    'nav.cars': 'Авто',
    'nav.howItWorks': 'Как это работает',
    'nav.contact': 'Контакты',
    'nav.login': 'Вход',
    'nav.register': 'Регистрация',
    'nav.account': 'Аккаунт',
    'nav.bookNow': 'Забронировать',
    'nav.myRentals': 'Мои аренды',
    'nav.dashboard': 'Панель',
    'nav.tariffs': 'Тарифы',
    'nav.maintenance': 'Обслуживание',
    'nav.rentals': 'Аренды',
    'nav.logout': 'Выйти',
    'search.pickupLocation': 'Точка выдачи',
    'search.anyLocation': 'Любая локация',
    'search.vehicleClass': 'Класс автомобиля',
    'search.anyClass': 'Любой класс',
    'search.pickupDate': 'Дата начала',
    'search.returnDate': 'Дата возврата',
    'search.rangeError': 'Дата возврата должна быть позже даты начала.',
    'search.availabilityVerified': 'Доступность проверена',
    'search.instantConfirmation': 'Мгновенное подтверждение',
    'search.noHiddenFees': 'Без скрытых платежей',
    'search.submit': 'Поиск',
    'common.tryAgain': 'Повторить',
    'common.confirm': 'Подтвердить',
    'common.cancel': 'Отмена',
    'common.pleaseWait': 'Подождите...',
    'common.back': 'Назад',
    'common.save': 'Сохранить',
    'common.open': 'Открыть',
    'common.details': 'Детали',
    'common.edit': 'Редактировать',
    'common.remove': 'Удалить',
    'common.all': 'Все',
    'common.active': 'Активные',
    'common.history': 'История',
    'common.order': 'Заказ',
    'common.days': 'дн.',
    'common.total': 'Итого',
    'common.from': 'От',
    'common.location': 'Локация',
    'common.seats': 'мест',
    'common.perDay': '/ сутки',
    'common.currentStatus': 'Текущий статус',
    'common.unavailableSelectedDates': 'Недоступно на выбранные даты',
    'common.actorRole': 'Роль участника',
    'rental.priceBreakdown': 'Расчёт стоимости',
    'rental.selectedTariff': 'Выбранный тариф',
    'rental.baseFee': 'Базовая цена',
    'rental.total': 'Итого',
    'auth.signIn': 'Вход',
    'auth.accessAccount': 'Вход в аккаунт',
    'auth.chooseWorkspace': 'Выберите рабочую зону и перейдите в нужный раздел сервиса.',
    'auth.clientPortal': 'Клиент',
    'auth.fleetDesk': 'Менеджер',
    'auth.email': 'Email',
    'auth.password': 'Пароль',
    'auth.continue': 'Продолжить',
    'auth.createAccount': 'Создать аккаунт',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.haveAccount': 'Уже есть аккаунт?',
    'auth.registerTitle': 'Создание аккаунта',
    'auth.registerSubtitle': 'Начните с клиентского аккаунта и получите доступ к бронированию, арендам и отслеживанию статусов.',
    'auth.fullName': 'Имя и фамилия',
    'auth.phone': 'Телефон',
    'auth.goRegister': 'Зарегистрироваться',
    'auth.goLogin': 'Войти',
    'auth.heroTitle': 'Премиальный доступ к арендам, автопарку и бронированиям.',
    'auth.heroSubtitle': 'Войдите, чтобы управлять заказами, выдачей автомобилей и доступностью автопарка.',
    'auth.availabilityControl': 'Контроль доступности',
    'auth.availabilityDesc': 'Бронирования проверяются по окнам обслуживания и пересечениям аренд.',
    'auth.operationalWorkflow': 'Операционный сценарий',
    'auth.operationalDesc': 'Выдавайте и завершайте аренды с историей статусов и фиксацией возврата.',
    'errors.403Title': 'Доступ запрещён',
    'errors.403Text': 'Эта страница предназначена для другой роли. Клиентская и менеджерская зоны разделены правами доступа.',
    'errors.404Title': 'Страница не найдена',
    'errors.404Text': 'Маршрут не существует или был перемещён. Используйте основную навигацию для продолжения.',
    'errors.goLogin': 'К странице входа',
    'errors.goClient': 'В клиентский раздел',
  },
}

function detectLocale(): AppLocale {
  if (typeof window === 'undefined') {
    return 'en'
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'ru' || saved === 'en') {
    return saved
  }

  const browserLocale = window.navigator.language.toLowerCase()
  return browserLocale.startsWith('ru') ? 'ru' : 'en'
}

const locale = ref<AppLocale>(detectLocale())

function syncLocale(nextLocale: AppLocale) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, nextLocale)
  document.documentElement.lang = nextLocale
}

syncLocale(locale.value)

export function getCurrentLocale(): AppLocale {
  return locale.value
}

export function getCurrentLocaleCode(): string {
  return locale.value === 'ru' ? 'ru-RU' : 'en-US'
}

export function setLocale(nextLocale: AppLocale) {
  locale.value = nextLocale
  syncLocale(nextLocale)
}

export function toggleLocale() {
  setLocale(locale.value === 'ru' ? 'en' : 'ru')
}

export function translate(key: string, params?: Record<string, string | number>) {
  let template = messages[locale.value][key] ?? messages.en[key] ?? key

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      template = template.replaceAll(`{${paramKey}}`, String(value))
    })
  }

  return template
}

export function useI18n() {
  return {
    locale: readonly(locale),
    setLocale,
    toggleLocale,
    t: translate,
  }
}
