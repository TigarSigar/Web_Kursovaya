import { http, USE_MOCK_API } from '@/api/http'
import { mapBackendRental, toBackendRentalCreatePayload, type BackendRental } from '@/api/backend'
import { mockDb } from '@/mock/database'
import type { RentalCreatePayload } from '@/types/entities'

export const rentalsApi = {
  list: async () => (USE_MOCK_API ? mockDb.listRentals() : (await http.get<BackendRental[]>('/rentals')).map(mapBackendRental)),
  getById: async (id: string) => (USE_MOCK_API ? mockDb.getRental(id) : mapBackendRental(await http.get<BackendRental>(`/rentals/${id}`))),
  create: (payload: RentalCreatePayload) =>
    USE_MOCK_API ? mockDb.createRental(payload) : http.post<BackendRental>('/rentals', toBackendRentalCreatePayload(payload)).then(mapBackendRental),
  issue: (id: string) => (USE_MOCK_API ? mockDb.issueRental(id) : http.patch<BackendRental>(`/rentals/${id}/issue`).then(mapBackendRental)),
  complete: (id: string) =>
    USE_MOCK_API ? mockDb.completeRental(id) : http.patch<BackendRental>(`/rentals/${id}/complete`).then(mapBackendRental),
  cancel: (id: string) =>
    USE_MOCK_API ? mockDb.cancelRental(id) : http.patch<BackendRental>(`/rentals/${id}/cancel`).then(mapBackendRental),
}
