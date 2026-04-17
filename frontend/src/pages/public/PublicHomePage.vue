<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowRight,
  CalendarCheck2,
  Car,
  Clock3,
  CreditCard,
  Headphones,
  KeyRound,
  MapPin,
  Shield,
} from 'lucide-vue-next'
import SearchForm from '@/components/cars/SearchForm.vue'
import CarCard from '@/components/cars/CarCard.vue'
import heroImage from '@/assets/hero.png'
import { useI18n } from '@/i18n'
import { useCarsStore } from '@/store/cars'
import type { SearchCarsParams } from '@/types/entities'

const router = useRouter()
const carsStore = useCarsStore()
const { locale } = useI18n()

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        titleLine1: 'Путешествуйте',
        titleLine2: 'с уверенностью',
        titleLine3: 'и комфортом',
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
        infoCardTitle: 'Что входит',
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
      }
    : {
        titleLine1: 'Drive with',
        titleLine2: 'Confidence',
        titleLine3: 'and Comfort',
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
        infoCardTitle: 'What is included',
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
)

const featuredCars = computed(() => carsStore.items.filter((car) => car.status === 'AVAILABLE').slice(0, 3))
const locations = computed(() => [...new Set(carsStore.items.map((car) => car.location))])
const heroStats = computed(() => [
  { value: `${carsStore.items.length || 0}+`, label: copy.value.heroStatFleet },
  { value: '24/7', label: copy.value.heroStatSupport },
  { value: 'UI', label: copy.value.heroStatTheme },
])

onMounted(async () => {
  if (carsStore.items.length === 0) {
    await carsStore.fetchAll()
  }
})

function handleSearch(params: SearchCarsParams) {
  router.push({
    path: '/cars',
    query: {
      from: params.from,
      to: params.to,
      ...(params.location ? { location: params.location } : {}),
      ...(params.carClass ? { carClass: params.carClass } : {}),
    },
  })
}
</script>

<template>
  <div class="public-home">
    <section class="public-home__hero">
      <div class="public-home__glow public-home__glow--top" />
      <div class="public-home__glow public-home__glow--bottom" />
      <div class="public-home__container">
        <div class="public-home__hero-grid">
          <div class="public-home__hero-copy">
            <div class="page-header public-home__hero-header">
              <div>
                <p class="page-kicker">CarGO</p>
                <h1 class="page-title public-home__hero-title">
                  {{ copy.titleLine1 }}
                  <span class="text-primary">{{ copy.titleLine2 }}</span>
                  <br />
                  {{ locale === 'ru' ? 'Выбирайте' : 'Travel with' }}
                  <span class="text-primary">{{ copy.titleLine3 }}</span>
                </h1>
                <p class="page-subtitle public-home__hero-subtitle">{{ copy.subtitle }}</p>
              </div>
            </div>

            <div class="public-home__hero-actions">
              <RouterLink class="btn-primary" to="/cars">
                {{ copy.explore }}
                <ArrowRight class="h-5 w-5" />
              </RouterLink>
              <a class="btn-secondary" href="#how-it-works">{{ copy.about }}</a>
            </div>

            <div class="public-home__stats">
              <div v-for="item in heroStats" :key="item.label" class="public-home__stat card-base">
                <span class="public-home__stat-value">{{ item.value }}</span>
                <span class="public-home__stat-label">{{ item.label }}</span>
              </div>
            </div>
          </div>

          <div class="public-home__hero-visual">
            <div class="public-home__visual-frame glass-panel">
              <div class="public-home__visual-media">
                <img :src="heroImage" alt="CarGO fleet" class="public-home__visual-image" />
              </div>

              <div class="public-home__visual-body">
                <p class="public-home__visual-caption">{{ copy.heroCaption }}</p>

                <div class="public-home__visual-points">
                  <div class="public-home__visual-point">
                    <MapPin class="h-5 w-5 text-primary" />
                    <div>
                      <strong>{{ copy.heroPointLocation }}</strong>
                      <p>{{ copy.heroPointLocationText }}</p>
                    </div>
                  </div>
                  <div class="public-home__visual-point">
                    <Shield class="h-5 w-5 text-primary" />
                    <div>
                      <strong>{{ copy.heroPointService }}</strong>
                      <p>{{ copy.heroPointServiceText }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="public-home__search">
          <SearchForm :locations="locations" @submit="handleSearch" />
        </div>
      </div>
    </section>

    <section class="public-home__section">
      <div class="public-home__container">
        <div class="public-home__section-head">
          <div>
            <p class="page-kicker">01</p>
            <h2 class="page-title public-home__section-title">{{ copy.featured }}</h2>
          </div>
          <p class="page-subtitle public-home__section-subtitle">{{ copy.featuredText }}</p>
        </div>

        <div class="public-home__cars-grid">
          <CarCard
            v-for="car in featuredCars"
            :key="car.id"
            :car="car"
            :action-label="copy.view"
            :action-to="`/cars?carClass=${car.carClass}`"
          />
        </div>

        <div class="public-home__section-action">
          <RouterLink class="btn-secondary" to="/cars">
            {{ copy.all }}
            <ArrowRight class="h-5 w-5" />
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="public-home__section public-home__section--alt">
      <div class="public-home__container public-home__info-grid">
        <article class="public-home__feature-panel glass-panel">
          <div class="public-home__feature-panel-body">
            <p class="page-kicker">02</p>
            <h2 class="page-title public-home__section-title">{{ copy.info }}</h2>
            <p class="page-subtitle public-home__feature-panel-subtitle">{{ copy.infoText }}</p>

            <div class="public-home__chip-row">
              <span class="chip">UI</span>
              <span class="chip">{{ locale === 'ru' ? 'Поиск' : 'Search' }}</span>
              <span class="chip">{{ locale === 'ru' ? 'Каталог' : 'Catalog' }}</span>
              <span class="chip">{{ locale === 'ru' ? 'Поддержка' : 'Support' }}</span>
            </div>

            <div class="public-home__info-card card-base">
              <strong>{{ copy.infoLead }}</strong>
              <p>{{ copy.infoCardText }}</p>
            </div>
          </div>
        </article>

        <div class="public-home__why-grid">
          <div class="public-home__why-intro">
            <p class="page-kicker">03</p>
            <h2 class="page-title public-home__section-title">{{ copy.why }}</h2>
            <p class="page-subtitle">{{ copy.whyText }}</p>
          </div>

          <article class="card-base public-home__why-card">
            <Shield class="h-6 w-6 text-primary" />
            <h3>{{ copy.insuranceTitle }}</h3>
            <p>{{ copy.insuranceText }}</p>
          </article>
          <article class="card-base public-home__why-card">
            <Headphones class="h-6 w-6 text-primary" />
            <h3>{{ copy.supportTitle }}</h3>
            <p>{{ copy.supportText }}</p>
          </article>
          <article class="card-base public-home__why-card">
            <CreditCard class="h-6 w-6 text-primary" />
            <h3>{{ copy.priceTitle }}</h3>
            <p>{{ copy.priceText }}</p>
          </article>
          <article class="card-base public-home__why-card">
            <Clock3 class="h-6 w-6 text-primary" />
            <h3>{{ copy.bookingTitle }}</h3>
            <p>{{ copy.bookingText }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="public-home__section">
      <div class="public-home__container">
        <div class="public-home__section-head">
          <div>
            <p class="page-kicker">04</p>
            <h2 class="page-title public-home__section-title">{{ copy.how }}</h2>
          </div>
          <p class="page-subtitle public-home__section-subtitle">{{ copy.howText }}</p>
        </div>

        <div class="public-home__steps">
          <article class="card-base public-home__step">
            <div class="public-home__step-icon"><MapPin class="h-6 w-6 text-primary" /></div>
            <span class="public-home__step-number">01</span>
            <h3>{{ copy.howLocationTitle }}</h3>
            <p>{{ copy.howLocationText }}</p>
          </article>
          <article class="card-base public-home__step">
            <div class="public-home__step-icon"><CalendarCheck2 class="h-6 w-6 text-primary" /></div>
            <span class="public-home__step-number">02</span>
            <h3>{{ copy.howDatesTitle }}</h3>
            <p>{{ copy.howDatesText }}</p>
          </article>
          <article class="card-base public-home__step">
            <div class="public-home__step-icon"><Car class="h-6 w-6 text-primary" /></div>
            <span class="public-home__step-number">03</span>
            <h3>{{ copy.howCarTitle }}</h3>
            <p>{{ copy.howCarText }}</p>
          </article>
          <article class="card-base public-home__step">
            <div class="public-home__step-icon"><KeyRound class="h-6 w-6 text-primary" /></div>
            <span class="public-home__step-number">04</span>
            <h3>{{ copy.howDriveTitle }}</h3>
            <p>{{ copy.howDriveText }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="public-home__section public-home__section--cta">
      <div class="public-home__container public-home__cta-grid">
        <article class="glass-panel public-home__cta-card">
          <p class="page-kicker">05</p>
          <h2 class="page-title public-home__section-title">{{ copy.request }}</h2>
          <p class="page-subtitle public-home__cta-text">{{ copy.requestText }}</p>

          <div class="public-home__hero-actions">
            <RouterLink class="btn-primary" to="/cars">
              {{ copy.requestPrimary }}
              <ArrowRight class="h-5 w-5" />
            </RouterLink>
            <a class="btn-secondary" href="#how-it-works">{{ copy.requestSecondary }}</a>
          </div>
        </article>

        <article class="card-base public-home__schedule-card">
          <p class="page-kicker">06</p>
          <h3 class="public-home__schedule-title">{{ copy.scheduleTitle }}</h3>
          <div class="public-home__schedule-hours">
            <Clock3 class="h-5 w-5 text-primary" />
            <span>{{ copy.scheduleHours }}</span>
          </div>
          <p class="public-home__schedule-text">{{ copy.scheduleText }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.public-home {
  --space-1: 8px;
  --space-2: 12px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
  --radius-sm: 8px;
  --radius-lg: 16px;

  &__container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
  }

  &__hero,
  &__section {
    position: relative;
    padding: var(--space-7) 0;
  }

  &__section--alt {
    background: var(--surface-section);
  }

  &__section--cta {
    padding-top: 0;
    padding-bottom: calc(var(--space-7) + var(--space-1));
  }

  &__glow {
    position: absolute;
    inset: 0;
    pointer-events: none;

    &--top {
      background: radial-gradient(circle at top center, rgba(var(--color-primary), 0.18), transparent 34%);
    }

    &--bottom {
      background: radial-gradient(circle at right bottom, rgba(var(--color-primary), 0.12), transparent 28%);
    }
  }

  &__hero-grid,
  &__info-grid,
  &__cta-grid {
    display: grid;
    gap: var(--space-5);
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
    align-items: start;
  }

  &__hero-header {
    margin-bottom: 0;
  }

  &__hero-title {
    max-width: 12ch;
  }

  &__hero-subtitle {
    max-width: 640px;
  }

  &__hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-4);
  }

  &__stats {
    display: grid;
    gap: var(--space-3);
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: var(--space-5);
  }

  &__stat {
    display: grid;
    gap: var(--space-1);
    padding: var(--space-3);
  }

  &__stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: rgb(var(--color-foreground));
  }

  &__stat-label {
    color: var(--text-muted);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  &__visual-frame,
  &__feature-panel,
  &__cta-card {
    padding: var(--space-1);
    border-radius: var(--radius-lg);
  }

  &__visual-media {
    overflow: hidden;
    border-radius: var(--radius-sm);
    aspect-ratio: 1.12;
    background: rgb(var(--color-surface-strong));
  }

  &__visual-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__visual-body,
  &__feature-panel-body {
    display: grid;
    gap: var(--space-4);
    padding: var(--space-4);
  }

  &__visual-caption {
    color: var(--text-soft);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  &__visual-points {
    display: grid;
    gap: var(--space-3);
  }

  &__visual-point {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr);
    gap: var(--space-3);
    align-items: start;
    padding: var(--space-3);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    background: var(--surface-glass);

    strong {
      display: block;
      color: rgb(var(--color-foreground));
      font-size: 0.95rem;
      font-weight: 600;
    }

    p {
      margin-top: var(--space-1);
      color: var(--text-muted);
      font-size: 0.875rem;
      line-height: 1.6;
    }
  }

  &__search {
    margin-top: var(--space-5);
  }

  &__section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
  }

  &__section-title {
    margin-top: var(--space-2);
  }

  &__section-subtitle {
    max-width: 460px;
  }

  &__cars-grid,
  &__steps {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &__section-action {
    display: flex;
    justify-content: center;
    margin-top: var(--space-5);
  }

  &__chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }

  &__info-card,
  &__schedule-card {
    display: grid;
    gap: var(--space-3);
    padding: var(--space-4);
  }

  &__info-card {
    strong {
      color: rgb(var(--color-foreground));
      font-size: 1.05rem;
      font-weight: 600;
      line-height: 1.5;
    }

    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.7;
    }
  }

  &__why-grid {
    display: grid;
    gap: var(--space-4);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__why-intro {
    grid-column: 1 / -1;
  }

  &__why-card,
  &__step {
    display: grid;
    gap: var(--space-3);
    padding: var(--space-4);
  }

  &__why-card h3,
  &__step h3,
  &__schedule-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__why-card p,
  &__step p,
  &__schedule-text {
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  &__step {
    grid-template-columns: auto 1fr;
    align-items: start;
  }

  &__step-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: var(--radius-lg);
    border: 1px solid rgba(var(--color-primary), 0.18);
    background: rgba(var(--color-primary), 0.1);
    grid-row: span 2;
  }

  &__step-number {
    color: rgb(var(--color-primary));
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  &__schedule-hours {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    min-height: 44px;
    padding: 0 var(--space-3);
    border-radius: var(--radius-sm);
    background: rgba(var(--color-primary), 0.1);
    color: rgb(var(--color-foreground));
    font-weight: 600;
  }

  &__cta-text {
    max-width: 560px;
  }
}

@media (min-width: 1024px) {
  .public-home {
    &__container {
      padding: 0 32px;
    }

    &__steps {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
}

@media (max-width: 1100px) {
  .public-home {
    &__hero-grid,
    &__info-grid,
    &__cta-grid {
      grid-template-columns: 1fr;
    }

    &__cars-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 768px) {
  .public-home {
    &__hero,
    &__section {
      padding: var(--space-6) 0;
    }

    &__section-head {
      align-items: start;
      flex-direction: column;
    }

    &__stats,
    &__cars-grid,
    &__why-grid,
    &__steps {
      grid-template-columns: 1fr;
    }

    &__hero-title {
      max-width: none;
    }
  }
}
</style>
