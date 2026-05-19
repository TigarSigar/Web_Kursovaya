<script setup lang="ts">
import { computed, onMounted, type Component } from 'vue'
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
import { useCarsStore } from '@/app/stores/cars'
import { getPublicHomeCopy } from '@/pages/public/publicHomeCopy'
import type { SearchCarsParams } from '@/types/entities'

const router = useRouter()
const carsStore = useCarsStore()
const { locale } = useI18n()

const copy = computed(() => getPublicHomeCopy(locale.value))

const infoChips = computed(() => [
  'UI',
  locale.value === 'ru' ? 'Поиск' : 'Search',
  locale.value === 'ru' ? 'Каталог' : 'Catalog',
  locale.value === 'ru' ? 'Поддержка' : 'Support',
])

interface HighlightCard {
  icon: Component
  title: string
  text: string
}

interface FlowStep {
  icon: Component
  title: string
  text: string
}

const highlightCards = computed<HighlightCard[]>(() => [
  {
    icon: Shield,
    title: copy.value.insuranceTitle,
    text: copy.value.insuranceText,
  },
  {
    icon: Headphones,
    title: copy.value.supportTitle,
    text: copy.value.supportText,
  },
  {
    icon: CreditCard,
    title: copy.value.priceTitle,
    text: copy.value.priceText,
  },
  {
    icon: Clock3,
    title: copy.value.bookingTitle,
    text: copy.value.bookingText,
  },
])

const flowSteps = computed<FlowStep[]>(() => [
  {
    icon: MapPin,
    title: copy.value.howLocationTitle,
    text: copy.value.howLocationText,
  },
  {
    icon: CalendarCheck2,
    title: copy.value.howDatesTitle,
    text: copy.value.howDatesText,
  },
  {
    icon: Car,
    title: copy.value.howCarTitle,
    text: copy.value.howCarText,
  },
  {
    icon: KeyRound,
    title: copy.value.howDriveTitle,
    text: copy.value.howDriveText,
  },
])

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
                  {{ copy.titleLine4Prefix }}
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
              <span v-for="chip in infoChips" :key="chip" class="chip">{{ chip }}</span>
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

          <article v-for="card in highlightCards" :key="card.title" class="card-base public-home__why-card">
            <component :is="card.icon" class="h-6 w-6 text-primary" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
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
          <article v-for="(step, index) in flowSteps" :key="step.title" class="card-base public-home__step">
            <div class="public-home__step-icon">
              <component :is="step.icon" class="h-6 w-6 text-primary" />
            </div>
            <span class="public-home__step-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
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
  --space-4: 20px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  &__container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
  }

  &__hero,
  &__section {
    position: relative;
    padding-top: 48px;
    padding-bottom: 48px;
  }

  &__hero {
    padding-top: 64px;
    padding-bottom: 48px;
  }

  &__section--alt {
    background: var(--surface-section);
  }

  &__section--cta {
    padding-top: 48px;
    padding-bottom: 48px;
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
    gap: 32px;
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
    gap: 12px;
    margin-top: 24px;
  }

  &__stats {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 24px;
  }

  &__stat {
    display: grid;
    gap: 8px;
    padding: 16px;
  }

  &__stat-value {
    font-size: 1.35rem;
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
    padding: 24px;
    border-radius: 20px;
  }

  &__visual-media {
    overflow: hidden;
    border-radius: 12px;
    aspect-ratio: 16 / 10;
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
    gap: 20px;
    padding: 24px;
  }

  &__visual-caption {
    color: var(--text-soft);
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  &__visual-points {
    display: grid;
    gap: 16px;
  }

  &__visual-point {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr);
    gap: 12px;
    align-items: start;
    padding: 16px;
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    background: var(--surface-glass);

    strong {
      display: block;
      color: rgb(var(--color-foreground));
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    p {
      margin-top: var(--space-1);
      color: var(--text-muted);
      font-size: var(--font-size-xs);
      line-height: 1.55;
    }
  }

  &__search {
    margin-top: 32px;
  }

  &__section-head {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 32px;
  }

  &__section-title {
    margin-top: var(--space-2);
  }

  &__section-subtitle {
    max-width: 520px;
  }

  &__cars-grid,
  &__steps {
    display: grid;
    gap: 32px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  &__section-action {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  &__chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  &__info-card,
  &__schedule-card {
    display: grid;
    gap: 12px;
    padding: 20px;
    border-radius: 16px;
  }

  &__info-card {
    strong {
      color: rgb(var(--color-foreground));
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.45;
    }

    p {
      color: var(--text-muted);
      font-size: var(--font-size-sm);
      line-height: 1.6;
    }
  }

  &__why-grid {
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__why-intro {
    grid-column: 1 / -1;
  }

  &__why-card,
  &__step {
    display: grid;
    gap: 12px;
    border-radius: 16px;
  }

  &__why-card {
    padding: 20px;
  }

  &__why-card h3,
  &__step h3,
  &__schedule-title {
    font-size: 1.0625rem;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__why-card p,
  &__step p,
  &__schedule-text {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
    line-height: 1.6;
  }

  &__step {
    gap: 8px;
    padding: 16px;
    grid-template-columns: 32px minmax(0, 1fr);
    align-items: start;

    h3,
    p {
      grid-column: 2;
    }

    h3 {
      margin-top: 0;
    }
  }

  &__step-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 10px;
    border: 1px solid rgba(var(--color-primary), 0.18);
    background: rgba(var(--color-primary), 0.1);
    grid-row: span 3;
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
    gap: 12px;
    min-height: 44px;
    padding: 0 16px;
    border-radius: 12px;
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
      gap: 24px;
    }

    &__cars-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
}

@media (max-width: 768px) {
  .public-home {
    &__container {
      padding: 0 24px;
    }

    &__hero,
    &__section {
      padding-top: 48px;
      padding-bottom: 48px;
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
