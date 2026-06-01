import { ApiError } from '@/api/http'
import { seedState, type MockDatabaseState } from '@/mock/seed'
import type {
  AvailableCarResult,
  Car,
  ClientProfile,
  DashboardStats,
  MaintenanceWindow,
  RentalCreatePayload,
  RentalOrder,
  RentalStatusHistory,
  SearchCarsParams,
  Tariff,
  UserAccount,
} from '@/types/entities'
import { hasBlockingMaintenance, hasBlockingRental, getMaintenanceOverlapReason, getRentalOverlapReason } from '@/utils/business'
import { formatDate, getTodayIsoDate, isDateInPast, isValidDateRange, overlaps } from '@/utils/date'
import { calculatePriceBreakdown } from '@/utils/price'

const LOCATION_LIMITS: Record<string, number> = {
  'Международный аэропорт Кемерово имени А.А.Леонова': 15,
  'Железнодорожный Вокзал города Кемерово': 15,
  'Кузбасс Арена': 10,
}

function getOccupiedSlotsAtDate(state: MockDatabaseState, location: string, dateIso: string): number {
  let count = 0;
  for (const car of state.cars) {
    let currentLocation = car.location;
    let isRented = false;
    
    const activeRentals = state.rentals
      .filter(r => r.carId === car.id && ['CREATED', 'CONFIRMED', 'ISSUED'].includes(r.status))
      .sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());
      
    for (const r of activeRentals) {
      if (dateIso >= r.from && dateIso < r.to) {
        isRented = true;
        break;
      }
      if (dateIso >= r.to) {
        currentLocation = r.returnLocation;
      }
    }
    
    if (!isRented && currentLocation === location) {
      count++;
    }
  }
  return count;
}

const STORAGE_KEY = 'car-rental-service-db-v1'
const LATENCY_MS = 180

function clone<T>(value: T): T {
  return structuredClone(value)
}

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(clone(value)), ms)
  })
}

function readState(): MockDatabaseState {
  const raw = window.localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedState))
    return clone(seedState)
  }

  return JSON.parse(raw) as MockDatabaseState
}

function writeState(state: MockDatabaseState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function nextId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function hydrateRental(state: MockDatabaseState, rental: RentalOrder): RentalOrder {
  return {
    ...rental,
    car: (() => {
      const car = state.cars.find((item) => item.id === rental.carId)
      return car ? normalizeCar(car) : undefined
    })(),
    client: state.clients.find((client) => client.id === rental.clientId),
    tariff: state.tariffs.find((tariff) => tariff.id === rental.tariffId),
  }
}

function hydrateMaintenance(state: MockDatabaseState, window: MaintenanceWindow): MaintenanceWindow {
  return {
    ...window,
    car: state.cars.find((car) => car.id === window.carId),
  }
}

function ensureCarExists(state: MockDatabaseState, carId: string): Car {
  const car = state.cars.find((item) => item.id === carId)

  if (!car) {
    throw new ApiError('Автомобиль не найден.', 404)
  }

  return normalizeCar(car)
}

function normalizeCar(car: Car): Car {
  const imageUrls = (car.imageUrls ?? []).filter(Boolean)
  if (imageUrls.length > 0) {
    return { ...car, imageUrls, imageUrl: imageUrls[0] }
  }

  if (car.imageUrl && !car.imageUrl.endsWith('.svg')) {
    return { ...car, imageUrls: [car.imageUrl] }
  }

  return { ...car, imageUrls: [], imageUrl: undefined }
}

function ensureTariffExists(state: MockDatabaseState, tariffId: string): Tariff {
  const tariff = state.tariffs.find((item) => item.id === tariffId)

  if (!tariff) {
    throw new ApiError('Тариф не найден.', 404)
  }

  return tariff
}

function ensureClientExists(state: MockDatabaseState, clientId: string): ClientProfile {
  const client = state.clients.find((item) => item.id === clientId)

  if (!client) {
    throw new ApiError('Клиент не найден.', 404)
  }

  return client
}

function appendHistory(rental: RentalOrder, entry: Omit<RentalStatusHistory, 'id' | 'rentalId'>): RentalOrder {
  return {
    ...rental,
    statusHistory: [
      ...rental.statusHistory,
      {
        ...entry,
        id: nextId('history'),
        rentalId: rental.id,
      },
    ],
  }
}

function validateDateRange(from: string, to: string): void {
  if (!isValidDateRange(from, to)) {
    throw new ApiError('Дата окончания должна быть позже даты начала.')
  }

  if (isDateInPast(from)) {
    throw new ApiError('Поиск и создание аренды доступны только на текущие и будущие даты.')
  }
}

function getAvailabilityReasons(state: MockDatabaseState, car: Car, params: SearchCarsParams, ignoredRentalId?: string): string[] {
  const reasons: string[] = []

  if (car.status === 'INACTIVE') {
    reasons.push('Автомобиль временно выведен из автопарка.')
  }

  const rental = hasBlockingRental(state.rentals, car.id, params.from, params.to, ignoredRentalId)
  if (rental) {
    reasons.push(getRentalOverlapReason(rental))
  }

  const maintenance = hasBlockingMaintenance(state.maintenanceWindows, car.id, params.from, params.to)
  if (maintenance) {
    reasons.push(getMaintenanceOverlapReason(maintenance))
  }

  return reasons
}

function setCarStatus(state: MockDatabaseState, carId: string, status: Car['status']): void {
  state.cars = state.cars.map((car) => (car.id === carId ? { ...car, status } : car))
}

function restoreCarOperationalStatus(state: MockDatabaseState, carId: string): void {
  const car = ensureCarExists(state, carId)

  if (car.status === 'INACTIVE') {
    return
  }

  const today = getTodayIsoDate()
  const inProgressMaintenance = state.maintenanceWindows.some(
    (window) => window.carId === carId && window.status === 'IN_PROGRESS' && overlaps(window.from, window.to, today, today),
  )
  const activeIssuedRental = state.rentals.some(
    (rental) => rental.carId === carId && rental.status === 'ISSUED' && overlaps(rental.from, rental.to, today, today),
  )

  if (inProgressMaintenance) {
    setCarStatus(state, carId, 'MAINTENANCE')
    return
  }

  if (activeIssuedRental) {
    setCarStatus(state, carId, 'RENTED')
    return
  }

  setCarStatus(state, carId, 'AVAILABLE')
}

export const mockDb = {
  async reset() {
    writeState(clone(seedState))
    return delay(true)
  },

  async getAccounts(): Promise<UserAccount[]> {
    return delay(readState().accounts)
  },

  async getClientProfile(clientId: string): Promise<ClientProfile> {
    const state = readState()
    return delay(ensureClientExists(state, clientId))
  },

  async updateClientProfile(clientId: string, payload: Partial<ClientProfile>): Promise<ClientProfile> {
    const state = readState()
    const client = ensureClientExists(state, clientId)
    const updated = { ...client, ...payload }
    state.clients = state.clients.map(c => c.id === clientId ? updated : c)
    writeState(state)
    return delay(updated)
  },

  async listCars(): Promise<Car[]> {
    return delay(readState().cars.map((car) => normalizeCar(car)))
  },

  async getCar(carId: string): Promise<Car> {
    const state = readState()
    return delay(ensureCarExists(state, carId))
  },

  async createCar(payload: Omit<Car, 'id'>): Promise<Car> {
    const state = readState()
    const car: Car = normalizeCar({ ...payload, id: nextId('car') })
    state.cars.unshift(car)
    writeState(state)
    return delay(car)
  },

  async updateCar(carId: string, payload: Omit<Car, 'id'>): Promise<Car> {
    const state = readState()
    ensureCarExists(state, carId)
    const updatedCar = normalizeCar({ ...payload, id: carId })
    state.cars = state.cars.map((car) => (car.id === carId ? updatedCar : car))
    writeState(state)
    return delay(updatedCar)
  },

  async deleteCar(carId: string): Promise<void> {
    const state = readState()
    ensureCarExists(state, carId)
    const hasActiveRental = state.rentals.some((rental) => rental.carId === carId && ['CREATED', 'CONFIRMED', 'ISSUED'].includes(rental.status))
    if (hasActiveRental) {
      throw new ApiError('Нельзя удалить автомобиль, пока у него есть активные или ожидающие аренды.')
    }

    state.cars = state.cars.filter((car) => car.id !== carId)
    writeState(state)
    await delay(undefined)
  },

  async listTariffs(): Promise<Tariff[]> {
    return delay(readState().tariffs)
  },

  async getTariff(tariffId: string): Promise<Tariff> {
    const state = readState()
    return delay(ensureTariffExists(state, tariffId))
  },

  async createTariff(payload: Omit<Tariff, 'id'>): Promise<Tariff> {
    const state = readState()
    const tariff: Tariff = { ...payload, id: nextId('tariff') }
    state.tariffs.unshift(tariff)
    writeState(state)
    return delay(tariff)
  },

  async updateTariff(tariffId: string, payload: Omit<Tariff, 'id'>): Promise<Tariff> {
    const state = readState()
    ensureTariffExists(state, tariffId)
    const tariff = { ...payload, id: tariffId }
    state.tariffs = state.tariffs.map((item) => (item.id === tariffId ? tariff : item))
    writeState(state)
    return delay(tariff)
  },

  async deleteTariff(tariffId: string): Promise<void> {
    const state = readState()
    ensureTariffExists(state, tariffId)

    const hasLinkedRentals = state.rentals.some((rental) => rental.tariffId === tariffId && ['CREATED', 'CONFIRMED', 'ISSUED'].includes(rental.status))
    if (hasLinkedRentals) {
      throw new ApiError('Тариф нельзя удалить, пока он используется в активных арендах.')
    }

    state.tariffs = state.tariffs.filter((tariff) => tariff.id !== tariffId)
    writeState(state)
    await delay(undefined)
  },

  async listMaintenance(): Promise<MaintenanceWindow[]> {
    const state = readState()
    return delay(state.maintenanceWindows.map((window) => hydrateMaintenance(state, window)))
  },

  async getMaintenance(windowId: string): Promise<MaintenanceWindow> {
    const state = readState()
    const window = state.maintenanceWindows.find((item) => item.id === windowId)

    if (!window) {
      throw new ApiError('Окно обслуживания не найдено.', 404)
    }

    return delay(hydrateMaintenance(state, window))
  },

  async createMaintenance(payload: Omit<MaintenanceWindow, 'id' | 'car'>): Promise<MaintenanceWindow> {
    const state = readState()
    ensureCarExists(state, payload.carId)
    validateDateRange(payload.from, payload.to)

    const blockingRental = hasBlockingRental(state.rentals, payload.carId, payload.from, payload.to)
    if (blockingRental) {
      throw new ApiError('Нельзя назначить обслуживание поверх существующей аренды.')
    }

    const blockingMaintenance = hasBlockingMaintenance(state.maintenanceWindows, payload.carId, payload.from, payload.to)
    if (blockingMaintenance) {
      throw new ApiError('Для этого автомобиля уже существует пересекающееся окно обслуживания.')
    }

    const window: MaintenanceWindow = { ...payload, id: nextId('maintenance') }
    state.maintenanceWindows.unshift(window)
    if (payload.status === 'IN_PROGRESS') {
      setCarStatus(state, payload.carId, 'MAINTENANCE')
    }
    writeState(state)
    return delay(hydrateMaintenance(state, window))
  },

  async updateMaintenance(windowId: string, payload: Omit<MaintenanceWindow, 'id' | 'car'>): Promise<MaintenanceWindow> {
    const state = readState()
    const existing = state.maintenanceWindows.find((item) => item.id === windowId)
    if (!existing) {
      throw new ApiError('Окно обслуживания не найдено.', 404)
    }

    validateDateRange(payload.from, payload.to)

    const blockingRental = hasBlockingRental(state.rentals, payload.carId, payload.from, payload.to)
    if (blockingRental) {
      throw new ApiError('Нельзя назначить обслуживание поверх существующей аренды.')
    }

    const blockingMaintenance = hasBlockingMaintenance(state.maintenanceWindows, payload.carId, payload.from, payload.to, windowId)
    if (blockingMaintenance) {
      throw new ApiError('Для этого автомобиля уже существует пересекающееся окно обслуживания.')
    }

    const window: MaintenanceWindow = { ...payload, id: windowId }
    state.maintenanceWindows = state.maintenanceWindows.map((item) => (item.id === windowId ? window : item))

    if (payload.status === 'IN_PROGRESS') {
      setCarStatus(state, payload.carId, 'MAINTENANCE')
    } else {
      restoreCarOperationalStatus(state, payload.carId)
    }

    writeState(state)
    return delay(hydrateMaintenance(state, window))
  },

  async deleteMaintenance(windowId: string): Promise<void> {
    const state = readState()
    const existing = state.maintenanceWindows.find((item) => item.id === windowId)
    if (!existing) {
      throw new ApiError('Окно обслуживания не найдено.', 404)
    }

    if (existing.status === 'IN_PROGRESS') {
      throw new ApiError('Нельзя удалить обслуживание, пока оно выполняется.')
    }

    state.maintenanceWindows = state.maintenanceWindows.filter((item) => item.id !== windowId)
    restoreCarOperationalStatus(state, existing.carId)
    writeState(state)
    await delay(undefined)
  },

  async searchAvailableCars(params: SearchCarsParams): Promise<AvailableCarResult[]> {
    validateDateRange(params.from, params.to)
    const state = readState()
    const filteredCars = state.cars.filter((car) => {
      if (params.location && car.location !== params.location) {
        return false
      }

      if (params.carClass && car.carClass !== params.carClass) {
        return false
      }

      return true
    })

    const results = filteredCars.map<AvailableCarResult>((car) => {
      const reasons = getAvailabilityReasons(state, car, params)
      return {
        car,
        tariffs: state.tariffs.filter((tariff) => tariff.carClass === car.carClass),
        available: reasons.length === 0,
        reasons,
      }
    })

    results.sort((left, right) => Number(right.available) - Number(left.available))
    return delay(results)
  },

  async listRentals(): Promise<RentalOrder[]> {
    const state = readState()
    return delay(state.rentals.map((rental) => hydrateRental(state, rental)))
  },

  async getRental(rentalId: string): Promise<RentalOrder> {
    const state = readState()
    const rental = state.rentals.find((item) => item.id === rentalId)
    if (!rental) {
      throw new ApiError('Аренда не найдена.', 404)
    }
    return delay(hydrateRental(state, rental))
  },

  async createRental(payload: RentalCreatePayload): Promise<RentalOrder> {
    const state = readState()
    validateDateRange(payload.from, payload.to)

    const car = ensureCarExists(state, payload.carId)
    const tariff = ensureTariffExists(state, payload.tariffId)
    ensureClientExists(state, payload.clientId)

    if (tariff.carClass !== car.carClass) {
      throw new ApiError('Выбранный тариф не подходит для класса автомобиля.')
    }

    const reasons = getAvailabilityReasons(state, car, { from: payload.from, to: payload.to })
    if (reasons.length > 0) {
      throw new ApiError(reasons[0])
    }

    const breakdown = calculatePriceBreakdown(tariff, payload.from, payload.to)
    if (breakdown.totalDays < tariff.minimumDays) {
      throw new ApiError(`Минимальная длительность аренды по тарифу ${tariff.name}: ${tariff.minimumDays} дн.`)
    }

    const limit = LOCATION_LIMITS[payload.returnLocation]
    if (limit !== undefined) {
      const occupied = getOccupiedSlotsAtDate(state, payload.returnLocation, payload.to)
      if (occupied >= limit) {
        throw new ApiError(`Локация возврата переполнена (занято ${occupied} из ${limit}). Выберите другую локацию.`)
      }
    }

    const rentalId = nextId('rental')
    const rental: RentalOrder = {
      id: rentalId,
      ...payload,
      totalDays: breakdown.totalDays,
      basePrice: breakdown.basePrice,
      dailyPrice: breakdown.dailyPrice,
      totalPrice: breakdown.totalPrice,
      status: 'CREATED',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          id: nextId('history'),
          rentalId,
          status: 'CREATED',
          changedAt: new Date().toISOString(),
          actorRole: 'CLIENT',
          note: `Заказ создан на период ${formatDate(payload.from)} - ${formatDate(payload.to)}.`,
        },
      ],
    }

    state.rentals.unshift(rental)
    writeState(state)
    return delay(hydrateRental(state, rental))
  },

  async issueRental(rentalId: string): Promise<RentalOrder> {
    const state = readState()
    const rental = state.rentals.find((item) => item.id === rentalId)
    if (!rental) {
      throw new ApiError('Аренда не найдена.', 404)
    }

    if (!['CREATED', 'CONFIRMED'].includes(rental.status)) {
      throw new ApiError('Выдать автомобиль можно только для созданной или подтвержденной аренды.')
    }

    const car = ensureCarExists(state, rental.carId)
    const reasons = getAvailabilityReasons(state, car, { from: rental.from, to: rental.to }, rentalId)
    if (reasons.length > 0) {
      throw new ApiError(reasons[0])
    }

    let updated = appendHistory(
      { ...rental, status: 'ISSUED' },
      {
        status: 'ISSUED',
        changedAt: new Date().toISOString(),
        actorRole: 'FLEET_MANAGER',
        note: 'Автомобиль выдан клиенту.',
      },
    )

    state.rentals = state.rentals.map((item) => (item.id === rentalId ? updated : item))
    setCarStatus(state, rental.carId, 'RENTED')
    writeState(state)
    updated = hydrateRental(state, updated)
    return delay(updated)
  },

  async completeRental(rentalId: string): Promise<RentalOrder> {
    const state = readState()
    const rental = state.rentals.find((item) => item.id === rentalId)
    if (!rental) {
      throw new ApiError('Аренда не найдена.', 404)
    }

    if (rental.status !== 'ISSUED') {
      throw new ApiError('Завершить можно только аренду в статусе ISSUED.')
    }

    const completed = appendHistory(
      {
        ...rental,
        status: 'COMPLETED',
        actualReturnAt: new Date().toISOString(),
      },
      {
        status: 'COMPLETED',
        changedAt: new Date().toISOString(),
        actorRole: 'FLEET_MANAGER',
        note: 'Фактическое время возврата зафиксировано.',
      },
    )

    state.rentals = state.rentals.map((item) => (item.id === rentalId ? completed : item))
    state.cars = state.cars.map((c) => c.id === rental.carId ? { ...c, location: rental.returnLocation } : c)
    restoreCarOperationalStatus(state, rental.carId)
    writeState(state)
    return delay(hydrateRental(state, completed))
  },

  async cancelRental(rentalId: string): Promise<RentalOrder> {
    const state = readState()
    const rental = state.rentals.find((item) => item.id === rentalId)
    if (!rental) {
      throw new ApiError('Аренда не найдена.', 404)
    }

    if (!['CREATED', 'CONFIRMED'].includes(rental.status)) {
      throw new ApiError('Отмена аренды запрещена после фактической выдачи автомобиля.')
    }

    const cancelled = appendHistory(
      { ...rental, status: 'CANCELLED' },
      {
        status: 'CANCELLED',
        changedAt: new Date().toISOString(),
        actorRole: 'CLIENT',
        note: 'Аренда отменена клиентом до выдачи.',
      },
    )

    state.rentals = state.rentals.map((item) => (item.id === rentalId ? cancelled : item))
    restoreCarOperationalStatus(state, rental.carId)
    writeState(state)
    return delay(hydrateRental(state, cancelled))
  },

  async getClientRentals(clientId: string): Promise<RentalOrder[]> {
    const state = readState()
    ensureClientExists(state, clientId)
    const rentals = state.rentals
      .filter((rental) => rental.clientId === clientId)
      .map((rental) => hydrateRental(state, rental))
    return delay(rentals)
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const state = readState()
    const stats: DashboardStats = {
      totalCars: state.cars.length,
      availableCars: state.cars.filter((car) => car.status === 'AVAILABLE').length,
      activeRentals: state.rentals.filter((rental) => rental.status === 'ISSUED').length,
      plannedMaintenance: state.maintenanceWindows.filter((window) => ['SCHEDULED', 'IN_PROGRESS'].includes(window.status)).length,
      createdRentals: state.rentals.filter((rental) => ['CREATED', 'CONFIRMED'].includes(rental.status)).length,
      monthlyRevenue: state.rentals
        .filter((rental) => rental.status === 'COMPLETED')
        .reduce((sum, rental) => sum + rental.totalPrice, 0),
    }

    return delay(stats)
  },

  async getLocations(): Promise<string[]> {
    return delay(readState().locations)
  },
}
