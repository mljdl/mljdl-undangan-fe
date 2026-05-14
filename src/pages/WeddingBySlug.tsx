import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { weddingApi } from '../api/wedding'
import { getTemplate } from '../templates/registry'
import type { TemplateWeddingData } from '../templates/types'

/**
 * Public real wedding renderer. Path: `/:slug` (mis. `/rizki-fadia`).
 */
export const WeddingBySlugPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [data, setData] = useState<TemplateWeddingData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [templateKey, setTemplateKey] = useState<string>('floral-watercolor')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    weddingApi
      .getBySlugPublic(slug)
      .then((res) => {
        setTemplateKey(res.templateSlug ?? 'floral-watercolor')
        const couple = (res.coupleData ?? {}) as Record<string, unknown>
        const evts = (res.events ?? []) as Array<Record<string, unknown>>
        const firstEvt = evts[0] ?? {}
        const mapped: TemplateWeddingData = {
          slug: res.slug,
          bride: (couple['bride'] as never) ?? null,
          groom: (couple['groom'] as never) ?? null,
          events: evts as never,
          bankAccounts: (res.bankAccounts as never) ?? [],
          weddingDateIso:
            (firstEvt['dateIso'] as string | undefined) ?? new Date().toISOString(),
        }
        setData(mapped)
      })
      .catch((err: ApiError) => setError(err.message))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-brown-deep">
        <p className="font-display text-2xl">Memuat undangan...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-brown-deep">
        <div className="text-center max-w-md mx-auto px-6">
          <p className="font-display text-3xl">Undangan tidak ditemukan</p>
          <p className="text-sm opacity-70 mt-3">
            {error ?? 'Mungkin undangan belum di-publish atau slug salah.'}
          </p>
        </div>
      </div>
    )
  }

  const template = getTemplate(templateKey)
  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-brown-deep">
        <p className="font-display text-2xl">Template {templateKey} tidak tersedia</p>
      </div>
    )
  }

  return <template.Component data={data} />
}
