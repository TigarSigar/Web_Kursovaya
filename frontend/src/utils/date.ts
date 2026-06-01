import { differenceInCalendarDays, format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'

export function parseDate(value: string): Date {
  return startOfDay(parseISO(value))
}

export function formatDate(value: string, pattern = 'dd.MM.yyyy'): string {
  return format(parseDate(value), pattern)
}

export function formatDateTime(value: string): string {
  return format(parseISO(value), 'dd.MM.yyyy HH:mm')
}

export function getTodayIsoDate(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function getRentalDays(from: string, to: string): number {
  const days = differenceInCalendarDays(parseDate(to), parseDate(from))
  return Math.max(1, days)
}

export function isValidDateRange(from: string, to: string): boolean {
  if (!from || !to) {
    return false
  }

  return isBefore(parseDate(from), parseDate(to))
}

export function isDateInPast(value: string): boolean {
  return isBefore(parseDate(value), startOfDay(new Date()))
}

export function overlaps(fromA: string, toA: string, fromB: string, toB: string): boolean {
  const startA = parseDate(fromA).getTime()
  const endA = parseDate(toA).getTime()
  const startB = parseDate(fromB).getTime()
  const endB = parseDate(toB).getTime()

  return startA < endB && startB < endA
}

export function isAfterOrEqual(first: string, second: string): boolean {
  return !isBefore(parseDate(first), parseDate(second))
}

export function isFutureDate(value: string): boolean {
  return isAfter(parseDate(value), startOfDay(new Date()))
}
