import * as SecureStore from 'expo-secure-store'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8787'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync('session_token')
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const authHeaders = await getAuthHeaders()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(response.status, (body as Record<string, string>).error ?? 'Request failed')
  }

  return response.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    }),

  postFormData: <T>(path: string, formData: FormData) =>
    request<T>(path, {
      method: 'POST',
      body: formData,
    }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
