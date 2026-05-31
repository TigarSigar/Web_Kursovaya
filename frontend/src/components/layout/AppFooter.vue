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
  <footer id="contact" class="border-t border-white/5 bg-[#05050d]">
    <div class="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-4 lg:px-8">
      <div>
        <div class="flex items-center gap-3">
          <div class="rounded-2xl bg-primary/20 p-3 text-primary">
            <Car class="h-5 w-5" />
          </div>
          <span class="text-3xl font-semibold text-white">Car<span class="text-primary">GO</span></span>
        </div>
        <p class="mt-5 text-sm leading-6 text-white/45">
          {{ copy.tagline }}
        </p>
      </div>
      <div>
        <h4 class="text-lg font-semibold text-white">{{ copy.quick }}</h4>
        <ul class="mt-5 space-y-3 text-sm text-white/45">
          <li><RouterLink class="hover:text-primary" to="/cars">{{ copy.browse }}</RouterLink></li>
          <li><a class="hover:text-primary" href="/#how-it-works">{{ copy.how }}</a></li>
          <li><RouterLink class="hover:text-primary" to="/client/account">{{ copy.account }}</RouterLink></li>
          <li><RouterLink class="hover:text-primary" to="/register">{{ copy.register }}</RouterLink></li>
        </ul>
      </div>
      <div>
        <h4 class="text-lg font-semibold text-white">{{ copy.support }}</h4>
        <ul class="mt-5 space-y-3 text-sm text-white/45">
          <li>{{ copy.help }}</li>
          <li>{{ copy.terms }}</li>
          <li>{{ copy.privacy }}</li>
        </ul>
      </div>
      <div>
        <h4 class="text-lg font-semibold text-white">{{ copy.contact }}</h4>
        <ul class="mt-5 space-y-3 text-sm text-white/45">
          <li>support@cargo-rental.com</li>
          <li>+7 (800) 555-40-40</li>
          <li>123 Rental Street, Auto City</li>
        </ul>
      </div>
    </div>
  </footer>
</template>
