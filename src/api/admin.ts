import type { Wedding, WeddingRsvp, WeddingStatus } from '../types'
import { api } from './client'

export interface AdminListQuery {
  status?: WeddingStatus
  assignedAdminUserId?: string
  search?: string
  skip?: number
  limit?: number
}

function qs(input: AdminListQuery): string {
  const params = new URLSearchParams()
  Object.entries(input).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  })
  const s = params.toString()
  return s ? `?${s}` : ''
}

export const adminApi = {
  list: (query: AdminListQuery = {}) =>
    api.get<{ items: Wedding[]; total: number }>(`/admin/wedding${qs(query)}`),

  detail: (id: string) => api.get<Wedding>(`/admin/wedding/${id}`),

  approve: (id: string, input: { publish?: boolean; comment?: string }) =>
    api.post<Wedding>(`/admin/wedding/${id}/approve`, input),

  reject: (id: string, comment: string) =>
    api.post<Wedding>(`/admin/wedding/${id}/reject`, { comment }),

  publish: (id: string) => api.post<Wedding>(`/admin/wedding/${id}/publish`),

  assign: (id: string, adminUserId: string) =>
    api.post<Wedding>(`/admin/wedding/${id}/assign`, { adminUserId }),

  listRsvp: (id: string) => api.get<{ items: WeddingRsvp[] }>(`/admin/wedding/${id}/rsvp`),
}
