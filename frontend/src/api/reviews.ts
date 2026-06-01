import type { CarReview, CarReviewPayload } from '@/types/entities'

const API_BASE = '/api/v1/cars'

export async function fetchCarReviews(carId: string): Promise<CarReview[]> {
  const response = await fetch(`${API_BASE}/${carId}/reviews`)
  if (!response.ok) {
    throw new Error('Failed to fetch reviews')
  }
  const data = await response.json()
  return data.content || []
}

export async function createCarReview(carId: string, clientId: string, payload: CarReviewPayload): Promise<CarReview> {
  const response = await fetch(`${API_BASE}/${carId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Id': clientId
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error('Failed to submit review')
  }
  return response.json()
}
