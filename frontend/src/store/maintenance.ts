import { defineStore } from 'pinia'
import { maintenanceApi } from '@/api/maintenance'
import type { MaintenanceWindow } from '@/types/entities'

interface MaintenanceState {
  items: MaintenanceWindow[]
  loading: boolean
  error: string | null
}

export const useMaintenanceStore = defineStore('maintenance', {
  state: (): MaintenanceState => ({
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    byId: (state) => (id: string) => state.items.find((window) => window.id === id),
  },
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await maintenanceApi.list()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Не удалось загрузить окна обслуживания.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async save(windowId: string | null, payload: Omit<MaintenanceWindow, 'id' | 'car'>) {
      if (windowId) {
        await maintenanceApi.update(windowId, payload)
      } else {
        await maintenanceApi.create(payload)
      }
      await this.fetchAll()
    },
    async remove(windowId: string) {
      await maintenanceApi.remove(windowId)
      await this.fetchAll()
    },
  },
})
