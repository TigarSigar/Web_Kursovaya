import { http, USE_MOCK_API } from '@/api/http'
import { mapBackendAvailability, mapBackendCar, type BackendAvailableCarResult, type BackendCar } from '@/api/backend'
import { mockDb } from '@/mock/database'
import type { Car, SearchCarsParams } from '@/types/entities'

export const carsApi = {
  list: async () => (USE_MOCK_API ? mockDb.listCars() : (await http.get<BackendCar[]>('/cars')).map(mapBackendCar)),
  getById: async (id: string) => (USE_MOCK_API ? mockDb.getCar(id) : mapBackendCar(await http.get<BackendCar>(`/cars/${id}`))),
  create: (payload: Omit<Car, 'id'>) =>
    USE_MOCK_API ? mockDb.createCar(payload) : http.post<BackendCar>('/cars', payload).then(mapBackendCar),
  update: (id: string, payload: Omit<Car, 'id'>) =>
    USE_MOCK_API ? mockDb.updateCar(id, payload) : http.put<BackendCar>(`/cars/${id}`, payload).then(mapBackendCar),
  remove: (id: string) => (USE_MOCK_API ? mockDb.deleteCar(id) : http.delete<void>(`/cars/${id}`)),
  searchAvailable: (params: SearchCarsParams) => {
    if (USE_MOCK_API) {
      return mockDb.searchAvailableCars(params)
    }

    const query = new URLSearchParams({
      from: params.from,
      to: params.to,
      ...(params.location ? { location: params.location } : {}),
      ...(params.carClass ? { carClass: params.carClass } : {}),
    })
    return http.get<BackendAvailableCarResult[]>(`/cars/available?${query.toString()}`).then((items) => items.map(mapBackendAvailability))
  },
}
