import { defineStore } from 'pinia'
import { tariffsApi } from '@/api/tariffs'
import type { Tariff } from '@/types/entities'

interface TariffsState {
  items: Tariff[]
  loading: boolean
  error: string | null
}

export const useTariffsStore = defineStore('tariffs', {
  state: (): TariffsState => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    byId: (state) => (id: string) => state.items.find((tariff) => tariff.id === id),
    byClass: (state) => (carClass: Tariff['carClass']) => state.items.filter((tariff) => tariff.carClass === carClass),
  },
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await tariffsApi.list()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не удалось загрузить тарифы.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async save(tariffId: string | null, payload: Omit<Tariff, 'id'>) {
      if (tariffId) {
        await tariffsApi.update(tariffId, payload)
      } else {
        await tariffsApi.create(payload)
      }
      await this.fetchAll()
    },
    async remove(tariffId: string) {
      await tariffsApi.remove(tariffId)
      await this.fetchAll()
    },
  },
})
