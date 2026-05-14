import type { WeddingRsvp } from '../types'
import { api } from './client'

export const rsvpApi = {
  /** Couple/admin list RSVP yang masuk. */
  list: (weddingId: string) =>
    api.get<{ items: WeddingRsvp[] }>(`/wedding/${weddingId}/rsvp`),

  /** Public submit (tamu). */
  submit: (
    slug: string,
    input: {
      name: string
      attend: 'hadir' | 'ragu' | 'tidak'
      count?: number
      message?: string
      inviteToken?: string
    },
  ) => api.post<WeddingRsvp>(`/public/wedding/${slug}/rsvp`, input, { skipAuth: true }),
}
