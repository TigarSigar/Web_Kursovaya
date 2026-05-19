export const USER_ROLES = ['CLIENT', 'FLEET_MANAGER'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const CAR_CLASSES = ['ECONOMY', 'COMFORT', 'BUSINESS', 'PREMIUM', 'SUV'] as const
export type CarClass = (typeof CAR_CLASSES)[number]

export const CAR_STATUSES = ['AVAILABLE', 'RENTED', 'MAINTENANCE', 'INACTIVE'] as const
export type CarStatus = (typeof CAR_STATUSES)[number]

export const RENTAL_STATUSES = ['CREATED', 'CONFIRMED', 'ISSUED', 'COMPLETED', 'CANCELLED'] as const
export type RentalStatus = (typeof RENTAL_STATUSES)[number]

export const MAINTENANCE_STATUSES = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED'] as const
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number]

export const TRANSMISSIONS = ['AUTOMATIC', 'MANUAL'] as const
export type TransmissionType = (typeof TRANSMISSIONS)[number]

export const FUEL_TYPES = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'] as const
export type FuelType = (typeof FUEL_TYPES)[number]

export interface Car {
  id: string
  vin: string
  plateNumber: string
  make: string
  model: string
  year: number
  carClass: CarClass
  status: CarStatus
  seats: number
  transmission: TransmissionType
  fuelType: FuelType
  location: string
  odometerKm: number
  imageUrl?: string
  imageUrls?: string[]
  notes?: string
}

export interface Tariff {
  id: string
  name: string
  carClass: CarClass
  basePrice: number
  dailyPrice: number
  minimumDays: number
  mileageLimitKm: number
  depositAmount: number
  insuranceIncluded: boolean
  restrictions: string[]
  description: string
}

export interface ClientProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  driverLicenseNumber: string
  driverLicenseExpiry: string
  memberSince: string
}

export interface UserAccount {
  id: string
  email: string
  fullName: string
  role: UserRole
  clientProfileId?: string
}

export interface RentalStatusHistory {
  id: string
  rentalId: string
  status: RentalStatus
  changedAt: string
  actorRole: UserRole
  note?: string
}

export interface RentalOrder {
  id: string
  carId: string
  clientId: string
  tariffId: string
  from: string
  to: string
  pickupLocation: string
  returnLocation: string
  totalDays: number
  basePrice: number
  dailyPrice: number
  totalPrice: number
  status: RentalStatus
  createdAt: string
  actualReturnAt?: string
  car?: Car
  client?: ClientProfile
  tariff?: Tariff
  statusHistory: RentalStatusHistory[]
}

export interface MaintenanceWindow {
  id: string
  carId: string
  from: string
  to: string
  serviceType: string
  comment: string
  status: MaintenanceStatus
  estimatedCost?: number
  car?: Car
}

export interface SearchCarsParams {
  from: string
  to: string
  location?: string
  carClass?: CarClass | ''
}

export interface PriceBreakdown {
  basePrice: number
  dailyPrice: number
  totalDays: number
  dailySubtotal: number
  totalPrice: number
}

export interface AvailableCarResult {
  car: Car
  tariffs: Tariff[]
  available: boolean
  reasons: string[]
}

export interface DashboardStats {
  totalCars: number
  availableCars: number
  activeRentals: number
  plannedMaintenance: number
  createdRentals: number
  monthlyRevenue: number
}

export interface CarFormModel {
  vin: string
  plateNumber: string
  make: string
  model: string
  year: number
  carClass: CarClass
  status: CarStatus
  seats: number
  transmission: TransmissionType
  fuelType: FuelType
  location: string
  odometerKm: number
  imageUrls: string[]
  notes: string
}

export interface TariffFormModel {
  name: string
  carClass: CarClass
  basePrice: number
  dailyPrice: number
  minimumDays: number
  mileageLimitKm: number
  depositAmount: number
  insuranceIncluded: boolean
  restrictionsText: string
  description: string
}

export interface MaintenanceFormModel {
  carId: string
  from: string
  to: string
  serviceType: string
  comment: string
  status: MaintenanceStatus
  estimatedCost: number | null
}

export interface RentalCreatePayload {
  carId: string
  tariffId: string
  clientId: string
  from: string
  to: string
  pickupLocation: string
  returnLocation: string
}

export interface TableColumn {
  key: string
  label: string
}
