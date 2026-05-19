import type {
  AvailableCarResult,
  Car,
  ClientProfile,
  MaintenanceWindow,
  RentalCreatePayload,
  RentalOrder,
  RentalStatusHistory,
  Tariff,
  UserAccount,
} from '@/types/entities'

interface BackendCar {
  id: number
  vin: string
  plateNumber: string
  make: string
  model: string
  year: number
  carClass: Car['carClass']
  status: Car['status']
  seats: number
  transmission: Car['transmission']
  fuelType: Car['fuelType']
  location: string
  odometerKm: number
  imageUrls: string[]
  notes?: string | null
}

interface BackendTariff {
  id: number
  name: string
  carClass: Tariff['carClass']
  basePrice: number
  dailyPrice: number
  minimumDays: number
  mileageLimitKm: number
  depositAmount: number
  insuranceIncluded: boolean
  restrictions: string[]
  description: string
}

interface BackendClient {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  driverLicenseNumber: string
  driverLicenseExpiry: string
  memberSince: string
}

interface BackendRentalStatusHistory {
  id: number
  rentalId: number
  status: RentalStatusHistory['status']
  changedAt: string
  actorRole: RentalStatusHistory['actorRole']
  note?: string
}

interface BackendRental {
  id: number
  carId: number
  clientId: number
  tariffId: number
  from: string
  to: string
  pickupLocation: string
  returnLocation: string
  totalDays: number
  basePrice: number
  dailyPrice: number
  totalPrice: number
  status: RentalOrder['status']
  createdAt: string
  actualReturnAt?: string | null
  car?: BackendCar | null
  client?: BackendClient | null
  tariff?: BackendTariff | null
  statusHistory: BackendRentalStatusHistory[]
}

interface BackendMaintenanceWindow {
  id: number
  carId: number
  from: string
  to: string
  serviceType: string
  comment: string
  status: MaintenanceWindow['status']
  estimatedCost?: number | null
  car?: BackendCar | null
}

interface BackendAvailableCarResult {
  car: BackendCar
  tariffs: BackendTariff[]
  available: boolean
  reasons: string[]
}

export function mapBackendCar(raw: BackendCar): Car {
  const imageUrls = raw.imageUrls ?? []
  return {
    ...raw,
    id: String(raw.id),
    imageUrls,
    imageUrl: imageUrls[0],
    notes: raw.notes ?? '',
  }
}

export function mapBackendTariff(raw: BackendTariff): Tariff {
  return {
    ...raw,
    id: String(raw.id),
  }
}

export function mapBackendClient(raw: BackendClient): ClientProfile {
  return {
    ...raw,
    id: String(raw.id),
  }
}

export function mapBackendRentalStatusHistory(raw: BackendRentalStatusHistory): RentalStatusHistory {
  return {
    ...raw,
    id: String(raw.id),
    rentalId: String(raw.rentalId),
  }
}

export function mapBackendRental(raw: BackendRental): RentalOrder {
  return {
    ...raw,
    id: String(raw.id),
    carId: String(raw.carId),
    clientId: String(raw.clientId),
    tariffId: String(raw.tariffId),
    actualReturnAt: raw.actualReturnAt ?? undefined,
    car: raw.car ? mapBackendCar(raw.car) : undefined,
    client: raw.client ? mapBackendClient(raw.client) : undefined,
    tariff: raw.tariff ? mapBackendTariff(raw.tariff) : undefined,
    statusHistory: raw.statusHistory.map(mapBackendRentalStatusHistory),
  }
}

export function mapBackendMaintenanceWindow(raw: BackendMaintenanceWindow): MaintenanceWindow {
  return {
    ...raw,
    id: String(raw.id),
    carId: String(raw.carId),
    estimatedCost: raw.estimatedCost ?? undefined,
    car: raw.car ? mapBackendCar(raw.car) : undefined,
  }
}

export function mapBackendAvailability(raw: BackendAvailableCarResult): AvailableCarResult {
  return {
    car: mapBackendCar(raw.car),
    tariffs: raw.tariffs.map(mapBackendTariff),
    available: raw.available,
    reasons: raw.reasons,
  }
}

export function toBackendRentalCreatePayload(payload: RentalCreatePayload) {
  return {
    clientId: Number(payload.clientId),
    carId: Number(payload.carId),
    tariffId: Number(payload.tariffId),
    startDate: payload.from,
    endDate: payload.to,
    pickupLocation: payload.pickupLocation,
    returnLocation: payload.returnLocation,
  }
}

export function toBackendMaintenancePayload(payload: Omit<MaintenanceWindow, 'id' | 'car'>) {
  return {
    carId: Number(payload.carId),
    startDate: payload.from,
    endDate: payload.to,
    description: payload.comment || payload.serviceType,
    serviceType: payload.serviceType,
    comment: payload.comment,
    status: payload.status,
    estimatedCost: payload.estimatedCost,
  }
}

export function toBackendClientPayload(payload: { fullName: string; email: string; phone: string }) {
  return {
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
  }
}

export function toDemoAccounts(clients: ClientProfile[]): UserAccount[] {
  const clientAccounts = clients.map<UserAccount>((client) => ({
    id: `account-client-${client.id}`,
    email: client.email,
    fullName: `${client.firstName} ${client.lastName}`.trim(),
    role: 'CLIENT',
    clientProfileId: client.id,
  }))

  return [
    ...clientAccounts,
    {
      id: 'account-manager-1',
      email: 'manager@carrent.local',
      fullName: 'Мария Менеджер',
      role: 'FLEET_MANAGER',
    },
  ]
}

export function buildClientAccountId(clientId: string): string {
  return `account-client-${clientId}`
}

export type {
  BackendAvailableCarResult,
  BackendCar,
  BackendClient,
  BackendMaintenanceWindow,
  BackendRental,
  BackendTariff,
}
