import { http, USE_MOCK_API } from '@/api/http'
import { mapBackendMaintenanceWindow, toBackendMaintenancePayload, type BackendMaintenanceWindow } from '@/api/backend'
import { mockDb } from '@/mock/database'
import type { MaintenanceWindow } from '@/types/entities'

export const maintenanceApi = {
  list: async () =>
    USE_MOCK_API ? mockDb.listMaintenance() : (await http.get<BackendMaintenanceWindow[]>('/maintenance-windows')).map(mapBackendMaintenanceWindow),
  getById: (id: string) =>
    USE_MOCK_API ? mockDb.getMaintenance(id) : http.get<BackendMaintenanceWindow>(`/maintenance-windows/${id}`).then(mapBackendMaintenanceWindow),
  create: (payload: Omit<MaintenanceWindow, 'id' | 'car'>) =>
    USE_MOCK_API
      ? mockDb.createMaintenance(payload)
      : http.post<BackendMaintenanceWindow>('/maintenance-windows', toBackendMaintenancePayload(payload)).then(mapBackendMaintenanceWindow),
  update: (id: string, payload: Omit<MaintenanceWindow, 'id' | 'car'>) =>
    USE_MOCK_API
      ? mockDb.updateMaintenance(id, payload)
      : http.put<BackendMaintenanceWindow>(`/maintenance-windows/${id}`, toBackendMaintenancePayload(payload)).then(mapBackendMaintenanceWindow),
  remove: (id: string) =>
    USE_MOCK_API ? mockDb.deleteMaintenance(id) : http.delete<void>(`/maintenance-windows/${id}`),
}
