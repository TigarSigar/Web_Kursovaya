export class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status = 400, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    })
  } catch {
    throw new ApiError('Backend API недоступен. Проверьте, что сервер запущен.', 503)
  }

  if (!response.ok) {
    let message = 'Ошибка запроса к backend API.'
    let details: unknown
    const rawText = await response.text()

    try {
      const payload = JSON.parse(rawText) as { message?: string; details?: unknown }
      message = payload.message || message
      details = payload.details
    } catch {
      if (rawText) {
        message = rawText
      }
    }

    throw new ApiError(message, response.status, details)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const http = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
}
