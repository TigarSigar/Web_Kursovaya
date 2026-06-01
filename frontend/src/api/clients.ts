import { http, USE_MOCK_API } from '@/api/http'
import { mapBackendClient, mapBackendRental, toBackendClientPayload, type BackendClient, type BackendRental } from '@/api/backend'
import { mockDb } from '@/mock/database'

export const clientsApi = {
  list: async () => (USE_MOCK_API ? [] : (await http.get<BackendClient[]>('/clients')).map(mapBackendClient)),
  create: async (payload: { fullName: string; email: string; phone: string }) =>
    USE_MOCK_API ? null : mapBackendClient(await http.post<BackendClient>('/clients', toBackendClientPayload(payload))),
  getProfile: async (id: string) => (USE_MOCK_API ? mockDb.getClientProfile(id) : mapBackendClient(await http.get<BackendClient>(`/clients/${id}`))),
  updateProfile: async (id: string, payload: { fullName: string; email: string; phone: string; driverLicenseNumber?: string; driverLicenseExpiry?: string; avatarBase64?: string }) => 
    (USE_MOCK_API ? mockDb.updateClientProfile(id, payload) : mapBackendClient(await http.put<BackendClient>(`/clients/${id}`, payload))),
  getRentals: (id: string) =>
    USE_MOCK_API ? mockDb.getClientRentals(id) : http.get<BackendRental[]>(`/clients/${id}/rentals`).then((items) => items.map(mapBackendRental)),
}
