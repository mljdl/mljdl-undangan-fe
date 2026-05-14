import type { Wedding } from '../types'
import { api } from './client'

export interface CreateWeddingInput {
  templateId: string
  slug?: string
}

export interface UpdateWeddingInput {
  coupleData?: Wedding['coupleData']
  events?: Wedding['events']
  bankAccounts?: Wedding['bankAccounts']
  theme?: Wedding['theme']
  hasCoupleAssets?: boolean
}

export const weddingApi = {
  create: (input: CreateWeddingInput) => api.post<Wedding>('/wedding', input),
  listMine: () => api.get<{ items: Wedding[]; total: number }>('/wedding/me'),
  detail: (id: string) => api.get<Wedding>(`/wedding/${id}`),
  update: (id: string, patch: UpdateWeddingInput) => api.patch<Wedding>(`/wedding/${id}`, patch),
  submitReview: (id: string, comment?: string) =>
    api.post<Wedding>(`/wedding/${id}/submit-review`, { comment }),
  /** Public renderer fetch by slug. */
  getBySlugPublic: (slug: string) =>
    api.get<Wedding>(`/public/wedding/${slug}`, { skipAuth: true }),
}
