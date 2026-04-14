import { http, USE_MOCK_API } from '@/api/http'
import { mockDb } from '@/mock/database'
import type { AvailableCarResult, Car, SearchCarsParams } from '@/types/entities'

export const carsApi = {
  list: () => (USE_MOCK_API ? mockDb.listCars() : http.get<Car[]>('/cars')),
  getById: (id: string) => (USE_MOCK_API ? mockDb.getCar(id) : http.get<Car>(`/cars/${id}`)),
  create: (payload: Omit<Car, 'id'>) => (USE_MOCK_API ? mockDb.createCar(payload) : http.post<Car>('/cars', payload)),
  update: (id: string, payload: Omit<Car, 'id'>) =>
    USE_MOCK_API ? mockDb.updateCar(id, payload) : http.put<Car>(`/cars/${id}`, payload),
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
    return http.get<AvailableCarResult[]>(`/cars/available?${query.toString()}`)
  },
}
