<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Calendar, ChevronDown, CreditCard, Mail, Phone, Users } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { mockDb } from '@/mock/database'
import type { ClientProfile, RentalOrder, UserAccount } from '@/types/entities'
import { formatCurrency } from '@/utils/format'
import StatusBadge from '@/components/common/StatusBadge.vue'

const { locale } = useI18n()

interface UserWithRentals {
  account: {
    id: string
    email: string
    fullName: string
    role: string
    clientProfileId?: string
  }
  profile?: ClientProfile
  rentals: RentalOrder[]
  expanded: boolean
}

const users = ref<UserWithRentals[]>([])
const loading = ref(true)

const copy = computed(() =>
  locale.value === 'ru'
    ? {
        kicker: 'Пользователи',
        title: 'Управление пользователями',
        subtitle: 'Просмотр зарегистрированных клиентов и их историй аренды.',
        name: 'ФИО',
        contact: 'Контакты',
        memberSince: 'Дата регистрации',
        license: 'ВУ',
        rentals: 'Аренды',
        noLicense: 'Не указано',
        history: 'История аренд',
        noHistory: 'Нет историй аренд',
        car: 'Автомобиль',
        dates: 'Даты',
        status: 'Статус',
        price: 'Сумма',
        totalSpent: 'Всего потрачено',
      }
    : {
        kicker: 'Users',
        title: 'User management',
        subtitle: 'View registered clients and their rental histories.',
        name: 'Full Name',
        contact: 'Contact',
        memberSince: 'Member Since',
        license: 'License',
        rentals: 'Rentals',
        noLicense: 'Not provided',
        history: 'Rental History',
        noHistory: 'No rental history',
        car: 'Car',
        dates: 'Dates',
        status: 'Status',
        price: 'Amount',
        totalSpent: 'Total spent',
      },
)

async function loadUsers() {
  loading.value = true
  try {
    const allAccounts = await mockDb.getAccounts()
    const clients = allAccounts.filter((acc: UserAccount) => acc.role === 'CLIENT')
    
    const enriched: UserWithRentals[] = []
    
    for (const acc of clients) {
      let profile
      let rentals: RentalOrder[] = []
      
      if (acc.clientProfileId) {
        profile = await mockDb.getClientProfile(acc.clientProfileId)
        if (profile) {
          rentals = await mockDb.getClientRentals(profile.id)
        }
      }
      
      enriched.push({
        account: acc,
        profile,
        rentals: rentals.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        expanded: false
      })
    }
    
    users.value = enriched
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})

function toggleExpanded(user: UserWithRentals) {
  user.expanded = !user.expanded
}

function calculateTotalSpent(rentals: RentalOrder[]) {
  return rentals.filter(r => r.status === 'COMPLETED').reduce((sum, r) => sum + r.totalPrice, 0)
}
</script>

<template>
  <section class="users-page">
    <div class="page-header">
      <div>
        <p class="page-kicker">{{ copy.kicker }}</p>
        <h1 class="page-title">{{ copy.title }}</h1>
        <p class="page-subtitle">{{ copy.subtitle }}</p>
      </div>
    </div>

    <div v-if="loading" class="users-page__loading">
      <div class="animate-pulse flex space-x-4">
        <div class="flex-1 space-y-4 py-1">
          <div class="h-4 bg-white/10 rounded w-3/4"></div>
          <div class="space-y-2">
            <div class="h-4 bg-white/10 rounded"></div>
            <div class="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="users-page__list">
      <div v-for="user in users" :key="user.account.id" class="card-base users-page__user-card">
        <div class="users-page__user-header" @click="toggleExpanded(user)">
          <div class="users-page__user-info">
            <div class="users-page__avatar">
              <Users class="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 class="users-page__user-name">{{ user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : user.account.fullName }}</h3>
              <p class="users-page__user-email">
                <Mail class="inline-block h-3 w-3 mr-1" />{{ user.account.email }}
              </p>
            </div>
          </div>
          
          <div class="users-page__user-meta">
            <div class="users-page__meta-item">
              <span class="users-page__meta-label">{{ copy.contact }}</span>
              <span class="users-page__meta-value">
                <Phone class="inline-block h-3 w-3 mr-1 text-muted" />
                {{ user.profile?.phone || copy.noLicense }}
              </span>
            </div>
            <div class="users-page__meta-item">
              <span class="users-page__meta-label">{{ copy.license }}</span>
              <span class="users-page__meta-value">
                <CreditCard class="inline-block h-3 w-3 mr-1 text-muted" />
                {{ user.profile?.driverLicenseNumber || copy.noLicense }}
              </span>
            </div>
            <div class="users-page__meta-item">
              <span class="users-page__meta-label">{{ copy.rentals }}</span>
              <span class="users-page__meta-value font-semibold text-primary">{{ user.rentals.length }}</span>
            </div>
          </div>

          <button class="users-page__expand-button" type="button">
            <ChevronDown class="h-5 w-5 transition-transform" :class="{ 'rotate-180': user.expanded }" />
          </button>
        </div>

        <transition name="toast">
          <div v-if="user.expanded" class="users-page__history">
            <div class="users-page__history-header">
              <h4 class="users-page__history-title">{{ copy.history }}</h4>
              <p v-if="user.rentals.length > 0" class="users-page__history-total">
                {{ copy.totalSpent }}: <strong>{{ formatCurrency(calculateTotalSpent(user.rentals)) }}</strong>
              </p>
            </div>

            <div v-if="user.rentals.length === 0" class="users-page__no-history">
              {{ copy.noHistory }}
            </div>
            <div v-else class="users-page__rentals-grid">
              <div v-for="rental in user.rentals" :key="rental.id" class="users-page__rental-item">
                <div class="users-page__rental-info">
                  <p class="users-page__rental-id">#{{ rental.id.split('-')[0] }}</p>
                  <p class="users-page__rental-dates">
                    <Calendar class="inline-block h-3 w-3 mr-1" />
                    {{ new Date(rental.from).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US') }} – {{ new Date(rental.to).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US') }}
                  </p>
                </div>
                
                <div class="users-page__rental-status">
                  <StatusBadge :status="rental.status" size="sm" />
                </div>
                
                <div class="users-page__rental-price">
                  {{ formatCurrency(rental.totalPrice) }}
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.users-page {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__user-card {
    overflow: hidden;
  }

  &__user-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    cursor: pointer;
    background: var(--surface-glass);
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--surface-glass-hover);
    }
  }

  &__user-info {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(var(--color-primary), 0.1);
  }

  &__user-name {
    font-size: 16px;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__user-email {
    margin-top: 4px;
    font-size: 13px;
    color: var(--text-muted);
  }

  &__user-meta {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-right: 24px;
  }

  &__meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__meta-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-faint);
  }

  &__meta-value {
    font-size: 14px;
    color: rgb(var(--color-foreground));
  }

  &__expand-button {
    color: var(--text-muted);
    padding: 8px;
    border-radius: 8px;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: rgb(var(--color-foreground));
    }
  }

  &__history {
    padding: 0 20px 20px;
    border-top: 1px solid var(--border-subtle);
    background: rgba(0, 0, 0, 0.1);
  }

  &__history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0 16px;
  }

  &__history-title {
    font-size: 15px;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__history-total {
    font-size: 14px;
    color: var(--text-muted);
    
    strong {
      color: rgb(var(--color-primary));
    }
  }

  &__no-history {
    padding: 20px;
    text-align: center;
    font-size: 14px;
    color: var(--text-muted);
    border: 1px dashed var(--border-subtle);
    border-radius: 8px;
  }

  &__rentals-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__rental-item {
    display: grid;
    grid-template-columns: minmax(120px, 1fr) auto 100px;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--surface-glass);
    border: 1px solid transparent;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: var(--border-subtle);
    }
  }

  &__rental-id {
    font-size: 13px;
    font-weight: 600;
    color: rgb(var(--color-foreground));
  }

  &__rental-dates {
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-muted);
  }

  &__rental-status {
    display: flex;
    justify-content: center;
  }

  &__rental-price {
    font-size: 14px;
    font-weight: 600;
    text-align: right;
    color: rgb(var(--color-foreground));
  }
}

@media (max-width: 768px) {
  .users-page {
    &__user-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    &__user-meta {
      width: 100%;
      justify-content: space-between;
      margin-right: 0;
      gap: 16px;
    }

    &__expand-button {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    &__rental-item {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      gap: 8px;
    }
    
    &__rental-status {
      justify-content: flex-start;
    }
    
    &__rental-price {
      text-align: left;
    }
  }
}
</style>
