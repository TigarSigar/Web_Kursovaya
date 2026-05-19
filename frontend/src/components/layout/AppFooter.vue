<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Car } from 'lucide-vue-next'
import { useI18n } from '@/i18n'

const { locale } = useI18n()

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        tagline: 'Премиальный сервис аренды автомобилей для уверенных поездок и прозрачного бронирования.',
        quick: 'Быстрые ссылки',
        support: 'Поддержка',
        contact: 'Контакты',
        browse: 'Каталог авто',
        how: 'Как это работает',
        account: 'Мой аккаунт',
        register: 'Регистрация',
        help: 'Центр помощи',
        terms: 'Условия сервиса',
        privacy: 'Политика конфиденциальности',
      }
    : {
        tagline: 'Premium car rental service built for confident travel and transparent booking.',
        quick: 'Quick Links',
        support: 'Support',
        contact: 'Contact',
        browse: 'Browse Cars',
        how: 'How It Works',
        account: 'My Account',
        register: 'Register',
        help: 'Help Center',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
      },
)
</script>

<template>
  <footer id="contact" class="surface-nav border-t border-border/40">
    <div class="layout-container grid gap-7 py-12 md:grid-cols-4">
      <div>
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-primary/20 p-3 text-primary">
            <Car class="h-5 w-5" />
          </div>
          <span class="text-2xl font-semibold text-foreground">Car<span class="text-primary">GO</span></span>
        </div>
        <p class="mt-4 text-sm leading-6 text-muted-foreground">
          {{ copy.tagline }}
        </p>
      </div>
      <div>
        <h4 class="text-base font-semibold text-foreground">{{ copy.quick }}</h4>
        <ul class="mt-4 space-y-2.5 text-sm text-muted-foreground">
          <li>
            <RouterLink class="hover:text-primary" to="/cars">{{ copy.browse }}</RouterLink>
          </li>
          <li>
            <a class="hover:text-primary" href="/#how-it-works">{{ copy.how }}</a>
          </li>
          <li>
            <RouterLink class="hover:text-primary" to="/login">{{ copy.account }}</RouterLink>
          </li>
          <li>
            <RouterLink class="hover:text-primary" to="/register">{{ copy.register }}</RouterLink>
          </li>
        </ul>
      </div>
      <div>
        <h4 class="text-base font-semibold text-foreground">{{ copy.support }}</h4>
        <ul class="mt-4 space-y-2.5 text-sm text-muted-foreground">
          <li>{{ copy.help }}</li>
          <li>{{ copy.terms }}</li>
          <li>{{ copy.privacy }}</li>
        </ul>
      </div>
      <div>
        <h4 class="text-base font-semibold text-foreground">{{ copy.contact }}</h4>
        <ul class="mt-4 space-y-2.5 text-sm text-muted-foreground">
          <li>support@cargo-rental.com</li>
          <li>+7 (800) 555-40-40</li>
          <li>123 Rental Street, Auto City</li>
        </ul>
      </div>
    </div>
  </footer>
</template>
