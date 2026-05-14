import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ApiError } from '../api/client'
import { weddingApi } from '../api/wedding'
import { getTemplate } from '../templates/registry'
import type { TemplateWeddingData } from '../templates/types'

/**
 * Demo / live preview untuk satu template.
 *
 * - `/preview/:templateSlug`               -> render dengan demo data
 * - `/preview/:templateSlug?slug=<slug>`   -> fetch real wedding by slug
 */
export const PreviewPage = () => {
  const { templateSlug } = useParams<{ templateSlug: string }>()
  const [searchParams] = useSearchParams()
  const [wedding, setWedding] = useState<TemplateWeddingData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const slugParam = searchParams.get('slug')

  useEffect(() => {
    if (!slugParam) return
    weddingApi
      .getBySlugPublic(slugParam)
      .then((data) => {
        const couple = (data.coupleData ?? {}) as Record<string, unknown>
        const evts = (data.events ?? []) as Array<Record<string, unknown>>
        const firstEvt = evts[0] ?? {}
        const mapped: TemplateWeddingData = {
          slug: data.slug,
          bride: (couple['bride'] as never) ?? null,
          groom: (couple['groom'] as never) ?? null,
          events: evts as never,
          bankAccounts: (data.bankAccounts as never) ?? [],
          weddingDateIso:
            (firstEvt['dateIso'] as string | undefined) ?? new Date().toISOString(),
        }
        setWedding(mapped)
      })
      .catch((err: ApiError) => setError(err.message))
  }, [slugParam])

  const template = templateSlug ? getTemplate(templateSlug) : null

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brown-deep">
        <div className="text-center">
          <p className="font-display text-2xl">Template tidak ditemukan</p>
          <p className="text-sm opacity-70 mt-2">Slug: {templateSlug}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return <template.Component data={template.defaultDemoData} previewMode />
  }

  return <template.Component data={wedding ?? template.defaultDemoData} previewMode />
}
