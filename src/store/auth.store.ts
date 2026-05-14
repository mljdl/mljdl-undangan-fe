import type { AuthSession, AuthUser } from '../types'

const STORAGE_KEY = 'mljdl-undgn:auth'
const ANON_KEY = 'mljdl-undgn:anon'

let session: AuthSession | null = null
let anonymousToken: string | null = null
const listeners = new Set<() => void>()

function persist(next: AuthSession | null) {
  session = next
  try {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  } catch { /* ignore */ }
  listeners.forEach((fn) => fn())
}

function persistAnonymous(token: string | null) {
  anonymousToken = token
  try {
    if (token) localStorage.setItem(ANON_KEY, token)
    else localStorage.removeItem(ANON_KEY)
  } catch { /* ignore */ }
}

function hydrate(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed?.accessToken || !parsed?.user) return null
    return parsed
  } catch {
    return null
  }
}

function hydrateAnonymous(): string | null {
  try {
    return localStorage.getItem(ANON_KEY)
  } catch {
    return null
  }
}

session = hydrate()
anonymousToken = hydrateAnonymous()

export const authStore = {
  getSession(): AuthSession | null { return session },
  getUser(): AuthUser | null { return session?.user ?? null },
  getAccessToken(): string | null { return session?.accessToken ?? null },
  getAnonymousToken(): string | null { return anonymousToken },
  isAuthenticated(): boolean { return !!session },
  hasRole(role: string): boolean { return !!session?.user?.roles?.includes(role) },
  setSession(next: AuthSession): void { persist(next) },
  setAnonymousToken(token: string | null): void { persistAnonymous(token) },
  clear(): void { persist(null); persistAnonymous(null) },
  subscribe(listener: () => void): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
