import { http, USE_MOCK_API } from '@/api/http'
import { mockDb } from '@/mock/database'
import type { RentalCreatePayload, RentalOrder } from '@/types/entities'

export const rentalsApi = {
  list: () => (USE_MOCK_API ? mockDb.listRentals() : http.get<RentalOrder[]>('/rentals')),
  getById: (id: string) => (USE_MOCK_API ? mockDb.getRental(id) : http.get<RentalOrder>(`/rentals/${id}`)),
  create: (payload: RentalCreatePayload) =>
    USE_MOCK_API ? mockDb.createRental(payload) : http.post<RentalOrder>('/rentals', payload),
  issue: (id: string) => (USE_MOCK_API ? mockDb.issueRental(id) : http.patch<RentalOrder>(`/rentals/${id}/issue`)),
  complete: (id: string) =>
    USE_MOCK_API ? mockDb.completeRental(id) : http.patch<RentalOrder>(`/rentals/${id}/complete`),
  cancel: (id: string) =>
    USE_MOCK_API ? mockDb.cancelRental(id) : http.patch<RentalOrder>(`/rentals/${id}/cancel`),
}
