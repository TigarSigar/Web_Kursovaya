import { defineStore } from 'pinia'
import { clientsApi } from '@/api/clients'
import { rentalsApi } from '@/api/rentals'
import type { RentalCreatePayload, RentalOrder } from '@/types/entities'

interface RentalsState {
  items: RentalOrder[]
  clientItems: RentalOrder[]
  currentRental: RentalOrder | null
  loading: boolean
  error: string | null
}

export const useRentalsStore = defineStore('rentals', {
  state: (): RentalsState => ({
    items: [],
    clientItems: [],
    currentRental: null,
    loading: false,
    error: null,
  }),
  getters: {
    byId: (state) => (id: string) =>
      state.items.find((rental) => rental.id === id) ?? state.clientItems.find((rental) => rental.id === id),
  },
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await rentalsApi.list()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не удалось загрузить аренды.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchForClient(clientId: string) {
      this.loading = true
      this.error = null
      try {
        this.clientItems = await clientsApi.getRentals(clientId)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не удалось загрузить аренды клиента.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchById(rentalId: string) {
      this.loading = true
      this.error = null
      try {
        this.currentRental = await rentalsApi.getById(rentalId)
        return this.currentRental
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не удалось загрузить детали аренды.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async create(payload: RentalCreatePayload) {
      const rental = await rentalsApi.create(payload)
      this.currentRental = rental
      return rental
    },
    async issue(rentalId: string) {
      const rental = await rentalsApi.issue(rentalId)
      this.currentRental = rental
      return rental
    },
    async complete(rentalId: string) {
      const rental = await rentalsApi.complete(rentalId)
      this.currentRental = rental
      return rental
    },
    async cancel(rentalId: string) {
      const rental = await rentalsApi.cancel(rentalId)
      this.currentRental = rental
      return rental
    },
  },
})
