import type { MaintenanceWindow, RentalOrder } from '@/types/entities'
import { overlaps } from '@/utils/date'

const BLOCKING_RENTAL_STATUSES = new Set(['CREATED', 'CONFIRMED', 'ISSUED'])
const BLOCKING_MAINTENANCE_STATUSES = new Set(['SCHEDULED', 'IN_PROGRESS'])

export function rentalBlocksAvailability(rental: RentalOrder): boolean {
  return BLOCKING_RENTAL_STATUSES.has(rental.status)
}

export function maintenanceBlocksAvailability(window: MaintenanceWindow): boolean {
  return BLOCKING_MAINTENANCE_STATUSES.has(window.status)
}

export function getRentalOverlapReason(rental: RentalOrder): string {
  if (rental.status === 'ISSUED') {
    return 'Автомобиль уже выдан по другой аренде на этот период.'
  }

  return 'На этот период уже создана или подтверждена другая аренда.'
}

export function getMaintenanceOverlapReason(window: MaintenanceWindow): string {
  if (window.status === 'IN_PROGRESS') {
    return 'Автомобиль находится в обслуживании и недоступен для выдачи.'
  }

  return 'На выбранные даты у автомобиля запланировано обслуживание.'
}

export function hasBlockingRental(
  rentals: RentalOrder[],
  carId: string,
  from: string,
  to: string,
  ignoredRentalId?: string,
): RentalOrder | undefined {
  return rentals.find(
    (rental) =>
      rental.carId === carId &&
      rental.id !== ignoredRentalId &&
      rentalBlocksAvailability(rental) &&
      overlaps(rental.from, rental.to, from, to),
  )
}

export function hasBlockingMaintenance(
  maintenanceWindows: MaintenanceWindow[],
  carId: string,
  from: string,
  to: string,
  ignoredMaintenanceId?: string,
): MaintenanceWindow | undefined {
  return maintenanceWindows.find(
    (window) =>
      window.carId === carId &&
      window.id !== ignoredMaintenanceId &&
      maintenanceBlocksAvailability(window) &&
      overlaps(window.from, window.to, from, to),
  )
}
