import { http, USE_MOCK_API } from '@/api/http'
import { mapBackendTariff, type BackendTariff } from '@/api/backend'
import { mockDb } from '@/mock/database'
import type { Tariff } from '@/types/entities'

export const tariffsApi = {
  list: async () => (USE_MOCK_API ? mockDb.listTariffs() : (await http.get<BackendTariff[]>('/tariffs')).map(mapBackendTariff)),
  getById: async (id: string) => (USE_MOCK_API ? mockDb.getTariff(id) : mapBackendTariff(await http.get<BackendTariff>(`/tariffs/${id}`))),
  create: (payload: Omit<Tariff, 'id'>) =>
    USE_MOCK_API ? mockDb.createTariff(payload) : http.post<BackendTariff>('/tariffs', payload).then(mapBackendTariff),
  update: (id: string, payload: Omit<Tariff, 'id'>) =>
    USE_MOCK_API ? mockDb.updateTariff(id, payload) : http.put<BackendTariff>(`/tariffs/${id}`, payload).then(mapBackendTariff),
  remove: (id: string) => (USE_MOCK_API ? mockDb.deleteTariff(id) : http.delete<void>(`/tariffs/${id}`)),
}
