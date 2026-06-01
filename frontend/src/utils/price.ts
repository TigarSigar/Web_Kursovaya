import type { PriceBreakdown, Tariff } from '@/types/entities'
import { getRentalDays } from '@/utils/date'

export function calculatePriceBreakdown(tariff: Tariff, from: string, to: string): PriceBreakdown {
  const totalDays = getRentalDays(from, to)
  const dailySubtotal = tariff.dailyPrice * totalDays
  const totalPrice = tariff.basePrice + dailySubtotal

  return {
    basePrice: tariff.basePrice,
    dailyPrice: tariff.dailyPrice,
    totalDays,
    dailySubtotal,
    totalPrice,
  }
}
