import { http, USE_MOCK_API } from '@/api/http'
import { mockDb } from '@/mock/database'
import type { Tariff } from '@/types/entities'

export const tariffsApi = {
  list: () => (USE_MOCK_API ? mockDb.listTariffs() : http.get<Tariff[]>('/tariffs')),
  getById: (id: string) => (USE_MOCK_API ? mockDb.getTariff(id) : http.get<Tariff>(`/tariffs/${id}`)),
  create: (payload: Omit<Tariff, 'id'>) =>
    USE_MOCK_API ? mockDb.createTariff(payload) : http.post<Tariff>('/tariffs', payload),
  update: (id: string, payload: Omit<Tariff, 'id'>) =>
    USE_MOCK_API ? mockDb.updateTariff(id, payload) : http.put<Tariff>(`/tariffs/${id}`, payload),
  remove: (id: string) => (USE_MOCK_API ? mockDb.deleteTariff(id) : http.delete<void>(`/tariffs/${id}`)),
}
