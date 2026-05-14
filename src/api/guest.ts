import type { WeddingGuest } from '../types'
import { api } from './client'

export const guestApi = {
  list: (weddingId: string) =>
    api.get<{ items: WeddingGuest[] }>(`/wedding/${weddingId}/guests`),

  add: (weddingId: string, input: { name: string; phone?: string }) =>
    api.post<WeddingGuest>(`/wedding/${weddingId}/guests`, input),

  update: (
    weddingId: string,
    guestId: string,
    patch: { name?: string; phone?: string; markShared?: boolean },
  ) => api.patch<WeddingGuest>(`/wedding/${weddingId}/guests/${guestId}`, patch),

  remove: (weddingId: string, guestId: string) =>
    api.delete<void>(`/wedding/${weddingId}/guests/${guestId}`),
}
