import type { AuthSession } from '../types'
import { authStore } from '../store/auth.store'
import { api } from './client'

// ── BE response shapes (after TransformInterceptor unwraps `data`) ──
interface AnonymousResponse {
  anonymousSession: { token: string; expiredAt: number }
}

interface SessionResponse {
  user: {
    id: string
    email: string
    name: string
    roleName: string
  }
  accessSession: { token: string; expiredAt: number }
  refreshSession: { token: string; expiredAt: number }
}

interface RegisterResponse {
  id: string
}

function toSession(res: SessionResponse): AuthSession {
  // roleName seperti "Couple"/"Wedding Admin"/"Wedding Superadmin". Normalisasi ke
  // lowercase_underscore supaya AuthGuard pakai sederet role check.
  const normRole = res.user.roleName.trim().toLowerCase().replace(/\s+/g, '_')
  return {
    accessToken: res.accessSession.token,
    refreshToken: res.refreshSession.token,
    user: {
      id: res.user.id,
      email: res.user.email,
      name: res.user.name,
      roles: [normRole],
    },
  }
}

async function ensureAnonymous(): Promise<string> {
  const existing = authStore.getAnonymousToken()
  if (existing) return existing
  const res = await api.post<AnonymousResponse>(
    '/auth/anonymous',
    undefined,
    { skipAuth: true, withClientCreds: true },
  )
  const token = res.anonymousSession.token
  authStore.setAnonymousToken(token)
  return token
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthSession> {
    await ensureAnonymous()
    const res = await api.post<SessionResponse>('/auth/session', { email, password })
    const session = toSession(res)
    authStore.setSession(session)
    return session
  },

  async logout(): Promise<void> {
    try {
      await api.delete('/auth/session')
    } finally {
      authStore.clear()
    }
  },

  async refresh(): Promise<AuthSession> {
    const refreshToken = authStore.getSession()?.refreshToken
    if (!refreshToken) throw new Error('No refresh token available')
    const res = await api.put<SessionResponse>(
      '/auth/session',
      undefined,
      { headers: { Authorization: `Bearer ${refreshToken}` }, skipAuth: true },
    )
    const session = toSession(res)
    authStore.setSession(session)
    return session
  },

  async register(input: { name: string; email: string; password: string }): Promise<AuthSession> {
    await ensureAnonymous()
    // /auth/register adalah endpoint khusus self-service couple. BE otomatis
    // assign role "Couple".
    await api.post<RegisterResponse>('/auth/register', input)
    // Setelah register, langsung login agar dapat session.
    return this.login(input.email, input.password)
  },
}
