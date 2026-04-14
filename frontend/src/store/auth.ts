import { defineStore } from 'pinia'
import { authApi } from '@/api/auth'
import { clientsApi } from '@/api/clients'
import type { ClientProfile, UserAccount, UserRole } from '@/types/entities'

const STORAGE_KEY = 'car-rental-auth-session'

interface AuthState {
  demoAccounts: UserAccount[]
  currentAccount: UserAccount | null
  currentClientProfile: ClientProfile | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    demoAccounts: [],
    currentAccount: null,
    currentClientProfile: null,
    loading: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentAccount),
    userRole: (state): UserRole | null => state.currentAccount?.role ?? null,
  },
  actions: {
    async init() {
      if (this.demoAccounts.length === 0) {
        this.demoAccounts = await authApi.listDemoAccounts()
      }

      const savedId = window.localStorage.getItem(STORAGE_KEY)
      if (!savedId) {
        return
      }

      const account = this.demoAccounts.find((item) => item.id === savedId)
      if (!account) {
        window.localStorage.removeItem(STORAGE_KEY)
        return
      }

      this.currentAccount = account
      if (account.clientProfileId) {
        this.currentClientProfile = await clientsApi.getProfile(account.clientProfileId)
      }
    },
    async login(accountId: string) {
      this.loading = true
      try {
        if (this.demoAccounts.length === 0) {
          this.demoAccounts = await authApi.listDemoAccounts()
        }

        const account = this.demoAccounts.find((item) => item.id === accountId)
        if (!account) {
          throw new Error('Демо-пользователь не найден.')
        }

        this.currentAccount = account
        this.currentClientProfile = account.clientProfileId ? await clientsApi.getProfile(account.clientProfileId) : null
        window.localStorage.setItem(STORAGE_KEY, account.id)
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.currentAccount = null
      this.currentClientProfile = null
      window.localStorage.removeItem(STORAGE_KEY)
    },
  },
})
