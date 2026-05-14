import type { ApiErrorBody } from '../types'
import { authStore } from '../store/auth.store'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_PREFIX = '/api/v1'
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || ''
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET || ''

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /** Skip Authorization (Bearer) header. */
  skipAuth?: boolean
  /** Tambah x-client-id/secret untuk panggilan /auth/anonymous. */
  withClientCreds?: boolean
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function performRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth = false, withClientCreds = false, headers = {}, ...rest } = options
  const url = `${API_BASE}${API_PREFIX}${path}`

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  }

  if (withClientCreds) {
    finalHeaders['x-client-id'] = CLIENT_ID
    finalHeaders['x-client-secret'] = CLIENT_SECRET
  }

  if (!skipAuth) {
    const token = authStore.getAccessToken() ?? authStore.getAnonymousToken()
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`
    }
  }

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const text = await res.text()
  let payload: unknown = null
  if (text) {
    try { payload = JSON.parse(text) } catch { /* non-JSON */ }
  }

  if (!res.ok) {
    const errBody = payload as ApiErrorBody | null
    const code = errBody?.error?.code ?? 'UNKNOWN_ERROR'
    const message = errBody?.error?.message ?? `Request failed (${res.status})`
    throw new ApiError(res.status, code, message)
  }

  const wrapped = payload as { data?: T } | null
  return (wrapped?.data ?? payload) as T
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    performRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    performRequest<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    performRequest<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    performRequest<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    performRequest<T>(path, { ...options, method: 'DELETE' }),
}
