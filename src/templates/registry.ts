import FloralWatercolor from './floral-watercolor'
import type { TemplateModule } from './types'

export const TEMPLATE_REGISTRY: Record<string, TemplateModule> = {
  'floral-watercolor': FloralWatercolor,
  // Tambah template baru di sini sebagai key -> module pair.
  // 'minimalist': Minimalist,
}

export function getTemplate(slug: string): TemplateModule | null {
  return TEMPLATE_REGISTRY[slug] ?? null
}

export function listTemplates(): TemplateModule[] {
  return Object.values(TEMPLATE_REGISTRY)
}
