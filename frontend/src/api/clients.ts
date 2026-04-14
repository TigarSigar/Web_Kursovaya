import { http, USE_MOCK_API } from '@/api/http'
import { mockDb } from '@/mock/database'
import type { ClientProfile, RentalOrder } from '@/types/entities'

export const clientsApi = {
  getProfile: (id: string) => (USE_MOCK_API ? mockDb.getClientProfile(id) : http.get<ClientProfile>(`/clients/${id}`)),
  getRentals: (id: string) =>
    USE_MOCK_API ? mockDb.getClientRentals(id) : http.get<RentalOrder[]>(`/clients/${id}/rentals`),
}
