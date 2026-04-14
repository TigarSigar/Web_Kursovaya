import { http, USE_MOCK_API } from '@/api/http'
import { mockDb } from '@/mock/database'
import type { MaintenanceWindow } from '@/types/entities'

export const maintenanceApi = {
  list: () => (USE_MOCK_API ? mockDb.listMaintenance() : http.get<MaintenanceWindow[]>('/maintenance-windows')),
  getById: (id: string) =>
    USE_MOCK_API ? mockDb.getMaintenance(id) : http.get<MaintenanceWindow>(`/maintenance-windows/${id}`),
  create: (payload: Omit<MaintenanceWindow, 'id' | 'car'>) =>
    USE_MOCK_API ? mockDb.createMaintenance(payload) : http.post<MaintenanceWindow>('/maintenance-windows', payload),
  update: (id: string, payload: Omit<MaintenanceWindow, 'id' | 'car'>) =>
    USE_MOCK_API ? mockDb.updateMaintenance(id, payload) : http.put<MaintenanceWindow>(`/maintenance-windows/${id}`, payload),
  remove: (id: string) =>
    USE_MOCK_API ? mockDb.deleteMaintenance(id) : http.delete<void>(`/maintenance-windows/${id}`),
}
