import { defineStore } from 'pinia'
import { carsApi } from '@/api/cars'
import type { AvailableCarResult, Car, SearchCarsParams } from '@/types/entities'

interface CarsState {
  items: Car[]
  searchResults: AvailableCarResult[]
  searchParams: SearchCarsParams | null
  loading: boolean
  error: string | null
}

export const useCarsStore = defineStore('cars', {
  state: (): CarsState => ({
    items: [],
    searchResults: [],
    searchParams: null,
    loading: false,
    error: null,
  }),
  getters: {
    byId: (state) => (id: string) => state.items.find((car) => car.id === id),
    featuredCars: (state) => state.items.filter((car) => car.status === 'AVAILABLE').slice(0, 3),
  },
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await carsApi.list()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не удалось загрузить автопарк.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async searchAvailable(params: SearchCarsParams) {
      this.loading = true
      this.error = null
      try {
        this.searchParams = params
        this.searchResults = await carsApi.searchAvailable(params)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не удалось получить результаты поиска.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async save(carId: string | null, payload: Omit<Car, 'id'>) {
      if (carId) {
        await carsApi.update(carId, payload)
      } else {
        await carsApi.create(payload)
      }
      await this.fetchAll()
    },
    async remove(carId: string) {
      await carsApi.remove(carId)
      await this.fetchAll()
    },
  },
})
