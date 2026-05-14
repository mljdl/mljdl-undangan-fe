import type { WeddingTemplate } from '../types'
import { api } from './client'

export const templateApi = {
  list: () =>
    api.get<{ items: WeddingTemplate[] }>('/public/wedding/templates', { skipAuth: true }),
  detail: (slug: string) =>
    api.get<WeddingTemplate>(`/public/wedding/templates/${slug}`, { skipAuth: true }),
}
