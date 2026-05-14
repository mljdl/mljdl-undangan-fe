import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../api/client'
import { weddingApi } from '../api/wedding'
import type { Wedding } from '../types'

export interface UseMyWeddingResult {
  wedding: Wedding | null
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

/**
 * Fetch the first wedding owned by the current user (MVP: 1 wedding per couple).
 */
export function useMyWedding(): UseMyWeddingResult {
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { items } = await weddingApi.listMine()
      setWedding(items[0] ?? null)
      setError(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal load wedding')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { wedding, loading, error, reload: load }
}
