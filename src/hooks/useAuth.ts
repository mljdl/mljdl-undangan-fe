import { useEffect, useState } from 'react'
import { authStore } from '../store/auth.store'
import type { AuthSession, AuthUser } from '../types'

export function useAuth(): {
  session: AuthSession | null
  user: AuthUser | null
  isAuthenticated: boolean
  hasRole: (role: string) => boolean
  hasAnyRole: (roles: string[]) => boolean
  logout: () => void
} {
  const [, setTick] = useState(0)

  useEffect(() => {
    return authStore.subscribe(() => setTick((t) => t + 1))
  }, [])

  const session = authStore.getSession()
  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    hasRole: (role) => authStore.hasRole(role),
    hasAnyRole: (roles) => roles.some((r) => authStore.hasRole(r)),
    logout: () => authStore.clear(),
  }
}
